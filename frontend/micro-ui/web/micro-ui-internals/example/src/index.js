import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { initLibraries } from "@egovernments/digit-ui-libraries";
import "@egovernments/digit-ui-health-css/example/index.css";
import { Loader } from "@egovernments/digit-ui-components";

// ✅ FIX: use static imports for ALL modules
import { initUtilitiesComponents } from "@egovernments/digit-ui-module-utilities";
import { initPGRComponents, PGRReducers } from "@egovernments/digit-ui-module-cms";
import { initWorkbenchComponents } from "@egovernments/digit-ui-module-workbench";
import { initHRMSComponents } from "@egovernments/digit-ui-module-hrms";

import { UICustomizations } from "./UICustomizations";
import { pgrCustomizations, pgrComponents } from "./pgr";

var Digit = window.Digit || {};

// Lazy load DigitUI
const DigitUI = React.lazy(() =>
  import("@egovernments/digit-ui-module-core").then((mod) => ({
    default: mod.DigitUI,
  }))
);

const enabledModules = ["Utilities", "PGR", "Workbench", "HRMS"];

const initTokens = (stateCode) => {
  const userType =
    window.sessionStorage.getItem("userType") ||
    process.env.REACT_APP_USER_TYPE ||
    "CITIZEN";

  const token =
    window.localStorage.getItem("token") ||
    process.env[`REACT_APP_${userType}_TOKEN`];

  const citizenInfo = window.localStorage.getItem("Citizen.user-info");
  const citizenTenantId =
    window.localStorage.getItem("Citizen.tenant-id") || stateCode;

  const employeeInfo = window.localStorage.getItem("Employee.user-info");
  const employeeTenantId = window.localStorage.getItem("Employee.tenant-id");

  const userTypeInfo =
    userType === "CITIZEN" || userType === "QACT"
      ? "citizen"
      : "employee";

  window.Digit.SessionStorage.set("user_type", userTypeInfo);
  window.Digit.SessionStorage.set("userType", userTypeInfo);

  if (userType !== "CITIZEN") {
    window.Digit.SessionStorage.set("User", {
      access_token: token,
      info: JSON.parse(employeeInfo),
    });
  }

  window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);

  if (employeeTenantId)
    window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);
};

const initDigitUI = async () => {
  window.contextPath =
    window?.globalConfigs?.getConfig("CONTEXT_PATH") || "digit-ui";

  window.Digit.Customizations = {
    commonUiConfig: UICustomizations,
    PGR: pgrCustomizations,
  };

  window?.Digit.ComponentRegistryService.setupRegistry({
    ...pgrComponents,
  });

  // ✅ FIX: remove dynamic imports completely
  // ✅ initialize modules directly
  initUtilitiesComponents();
  initPGRComponents();
  initWorkbenchComponents();
  initHRMSComponents();

  const moduleReducers = (initData) => ({
    pgr: PGRReducers(initData),
  });

  const stateCode =
    window?.globalConfigs?.getConfig("STATE_LEVEL_TENANT_ID") || "pb";

  initTokens(stateCode);

  ReactDOM.render(
    <Suspense fallback={<Loader page={true} variant={"PageLoader"} />}>
      <DigitUI
        stateCode={stateCode}
        enabledModules={enabledModules}
        defaultLanding="employee"
        moduleReducers={moduleReducers}
      />
    </Suspense>,
    document.getElementById("root")
  );
};

initLibraries().then(() => {
  initDigitUI();
});
