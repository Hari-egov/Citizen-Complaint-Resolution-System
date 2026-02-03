export const locationDetails = {
  "head": "CS_COMPLAINT_LOCATION_DETAILS",
  // "headerCaption": "CS_ADDCOMPLAINT_COMPLAINT_LOCATION",
  // "header": "CS_FILE_APPLICATION_PINCODE_LABEL",
  // "cardText": "CS_ADDCOMPLAINT_CHANGE_PINCODE_TEXT",
  "body": [
    // {
    //   "inline": true,
    //   "label": "CS_COMPLAINT_DETAILS_ADDRESS_1_DETAILS",
    //   "isMandatory": false,
    //   "type": "text",
    //   "key": "AddressOne",
    //   "disable": false,
    //   "populators": {
    //     "name": "AddressOne",
    //     "maxlength": 64
    //   }
    // },
    // {
    //   "inline": true,
    //   "label": "CS_COMPLAINT_DETAILS_ADDRESS_2_DETAILS",
    //   "isMandatory": false,
    //   "type": "text",
    //   "key": "AddressTwo",
    //   "disable": false,
    //   "populators": {
    //     "name": "AddressTwo",
    //     "maxlength": 64
    //   }
    // },
    {
      "inline": true,
      "label": "CS_COMPLAINT_LANDMARK__DETAILS",
      "isMandatory": false,
      "type": "text",
      "disable": false,
      "populators": {
        "name": "landmark",
        "maxlength": 64
      }
    },
    {
      "key": "SelectAddress",
      "type": "boundary",
      "inline": false,
      "disable": false,
      "populators": {
        validation: { required: true },
        error: "CORE_COMMON_REQUIRED_ERRMSG",
        "fieldPairClassName": "boundary-filter-label-left-align",
        "name": "boundaryComponent",
        "levelConfig": {
          "lowestLevel": "zone",
          "highestLevel": "region",
          isSingleSelect: ["zone", "region"]
        },
        "layoutConfig": {
          "isDropdownLayoutHorizontal": true,
          "isLabelFieldLayoutHorizontal": true

        },
        "hierarchyType": "ADMIN",
        "noCardStyle": false,
        "module": "CMS-BOUNDARY"
      }
    },
  /*  {
      "inline": true,
      "label": "CS_COMPLAINT_POSTALCODE__DETAILS",
      "isMandatory": false,
      "type": "number",
      "disable": false,
      "populators": {
        "name": "postalCode",
        "maxlength": 6,
        "value":"560001",
        validation: {
                  pattern: /^[1-9][0-9]{5}$/i,
                },
      }
    }*/
  ]
}