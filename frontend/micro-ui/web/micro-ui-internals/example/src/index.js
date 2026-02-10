import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { PGRReducers } from "@egovernments/digit-ui-module-ccrs";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import "@egovernments/digit-ui-health-css/example/index.css";
import { Loader } from "@egovernments/digit-ui-components";

import { UICustomizations } from "./UICustomizations";
import { pgrCustomizations, pgrComponents } from "./pgr";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";

var Digit = window.Digit || {};

const DigitUI = React.lazy(() =>
  import("@egovernments/digit-ui-module-core").then((mod) => ({
    default: mod.DigitUI,
  }))
);

const enabledModules = ["Utilities", "PGR", "Workbench", "HRMS"];

const initTokens = (stateCode) => {
  const userType = window.sessionStorage.getItem("userType") || process.env.REACT_APP_USER_TYPE || "CITIZEN";
  const token = window.localStorage.getItem("token") || process.env[`REACT_APP_${userType}_TOKEN`];

  const params = new URLSearchParams(window.location.search);
  const localeFromUrl = params.get("locale");
  const localeFromStorage = localStorage.getItem("Digit.locale");
  const finalLocale = localeFromUrl || localeFromStorage || "en_ET";

  // Write to both Storage types so Digit picks it up immediately
  const localeKeys = ["locale", "lang", "Citizen.locale", "Employee.locale", "Digit.locale"];
  localeKeys.forEach((key) => {
    Digit.SessionStorage.set(key, finalLocale);
    localStorage.setItem(key, finalLocale);
  });

  const citizenInfo = localStorage.getItem("Citizen.user-info");
  const citizenTenantId = localStorage.getItem("Citizen.tenant-id") || stateCode;
  const employeeInfo = localStorage.getItem("Employee.user-info");
  const employeeTenantId = localStorage.getItem("Employee.tenant-id");

  const userTypeInfo = userType === "CITIZEN" || userType === "QACT" ? "citizen" : "employee";
  Digit.SessionStorage.set("user_type", userTypeInfo);
  Digit.SessionStorage.set("userType", userTypeInfo);

  if (userType !== "CITIZEN") {
    Digit.SessionStorage.set("User", {
      access_token: token,
      info: employeeInfo ? JSON.parse(employeeInfo) : null,
    });
  }
  Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);
  if (employeeTenantId) {
    Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
  }
};

const initDigitUI = async () => {
  const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";
  
  // --- CRITICAL FIX: Force Language Sync before Render ---
  const params = new URLSearchParams(window.location.search);
  const currentLocale = params.get("locale") || localStorage.getItem("Digit.locale") || "en_ET";
  if (window.Digit?.LocalizationService) {
    await window.Digit.LocalizationService.changeLanguage(currentLocale, stateCode);
  }
  // -------------------------------------------------------

  window.contextPath = window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";
  window.Digit.Customizations = {
    commonUiConfig: UICustomizations,
    PGR: pgrCustomizations,
  };

  window?.Digit.ComponentRegistryService.setupRegistry({
    ...pgrComponents,
  });

  const [{ initUtilitiesComponents }, { initPGRComponents }] = await Promise.all([
    import("@egovernments/digit-ui-module-utilities"),
    import("@egovernments/digit-ui-module-ccrs"),
  ]);

  initUtilitiesComponents();
  initPGRComponents();
  initWorkbenchComponents();
  initHRMSComponents();

  const moduleReducers = (initData) => ({
    pgr: PGRReducers(initData),
  });

  ReactDOM.render(
    <Suspense fallback={<Loader page={true} variant={"PageLoader"} />}>
      <DigitUI stateCode={stateCode} enabledModules={enabledModules} defaultLanding="employee" moduleReducers={moduleReducers} />
    </Suspense>,
    document.getElementById("root")
  );
};

/* --- Execution Logic --- */
const stateCode = window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";

// 1. Set storage synchronously 
initTokens(stateCode);

// 2. Initialize libraries, then trigger UI setup
initLibraries().then(() => {
  initDigitUI();
});