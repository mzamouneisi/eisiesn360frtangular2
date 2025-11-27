
var YsakON = { // YsakObjectNotation
    stringify: function(o, prefix) {          
      prefix = prefix || 'root';
      
      switch (typeof o)
      {
        case 'object':
          if (Array.isArray(o))
            return prefix + '=' + JSON.stringify(o) + '\n';
          
          var output = ""; 
          for (var k in o)
          {
            if (o.hasOwnProperty(k)) 
              output += this.stringify(o[k], prefix + '.' + k);
          }
          return output;
        case 'function':
          return "";
        default:
          return prefix + '=' + o + '\n';
      }   
    }
  };
  
  var o = {
    "main.menu.navbar": {
      "navitem.caption.navigation": {
        "label": "Navigation"
      },
      "navitem.esn": {
        "title": "Esn Management"
      },
      "navitem.client": {
        "title": "Client Management"
      },
      "navitem.project": {
        "title": "Project Management"
      },
      "navitem.consultant": {
        "title": "Consultant Management"
      },
      "navitem.activityType": {
        "title": "ActivityType Management"
      },
      "navitem.activity": {
        "title": "{{title}} Management"
      },
      "navitem.cra": {
        "title": "Cra Management"
      },
      "navitem.caption.fee": {
        "label": "Fee Management"
      },
      "navitem.fee": {
        "category.title": "Fee Category Management",
        "note.title": "Fee Note Management"
      },
      "navitem.caption.setting": {
        "label": "Setting"
      },
      "navitem.setting": {
        "permission.title": "Permission Management",
        "holiday.title": "Holiday Management",
        "payment.mode.title": "Payment Mode Management"
      }
    },
    "app.form.input": {
      "placeholder": {
        "prefix": "Enter your"
      }
    },
    "app.badge": {
      "required": "is required"
    },
    "app.compo.esn": {
      "list": {
        "table": {
          "thead": {
            "name": "Name",
            "profession": "Profession",
            "street": "Street",
            "zipCode": "Zip Code",
            "city": "City",
            "country": "Country",
            "webSite": "WebSite",
            "tel": "Tel",
            "email": "Email",
            "respName": "RespName",
            "action": "Action"
          },
          "action": {
            "delete": "Delete",
            "add": "Add"
          }
        }
      },
      "form": {
        "input": {
          "name": "Name",
          "profession": "Profession",
          "street": "Street",
          "zipCode": "Zip Code",
          "city": "City",
          "country": "Country",
          "webSite": "WebSite",
          "tel": "Tel",
          "email": "Email",
          "respName": "RespName"
        },
        "button": {
          "list": "Back to list"
        }
      }
    },
    "app.compo.client": {
      "list": {
        "table": {
          "thead": {
            "name": "Name",
            "profession": "Profession",
            "street": "Street",
            "zipCode": "Zip Code",
            "city": "City",
            "country": "Country",
            "webSite": "WebSite",
            "respName": "RespName",
            "tel": "Tel",
            "email": "Email",
            "action": "Action"
          },
          "action": {
            "delete": "Delete",
            "add": "Add"
          }
        }
      },
      "form": {
        "input": {
          "name": "Name",
          "profession": "Profession",
          "street": "Street",
          "zipCode": "Zip Code",
          "city": "City",
          "country": "Country",
          "webSite": "WebSite",
          "tel": "Tel",
          "email": "Email",
          "respName": "RespName"
        },
        "button": {
          "list": "Back to list"
        }
      }
    },
    "app.compo.project": {
      "list": {
        "table": {
          "thead": {
            "name": "Name",
            "description": "Desc",
            "team": "Team",
            "method": "Method",
            "client": "Client",
            "action": "Action"
          },
          "action": {
            "delete": "DELETE",
            "add": "ADD"
          }
        }
      },
      "form": {
        "input": {
          "name": "Name",
          "description": "Desc",
          "teamNumber": "TeamNumber",
          "teamDesc": "TeamDesc",
          "method": "Method",
          "environment": "Env",
          "client": "Client",
          "comment": "Comment"
        },
        "button": {
          "list": "Back to list"
        }
      }
    },
    "app.compo.consultant": {
      "list": {
        "table": {
          "thead": {
            "name": "Name",
            "username": "Username",
            "tel": "Tel",
            "email": "Email",
            "esn": "Esn",
            "role": "Role",
            "action": "Actions"
          },
          "action": {
            "edit": "edit",
            "delete": "delete"
          }
        },
        "button": {
          "add": "ADD"
        }
      },
      "form": {
        "input": {
          "firstName": "First Name",
          "lastName": "Last Name",
          "tel": "Tel",
          "email": "Email",
          "birthDay": "Birth Day",
          "country": "Country",
          "city": "City",
          "zipCode": "ZipCode",
          "street": "Street",
          "role": "Role",
          "esn": "Esn",
          "manager": "Manager",
          "username": "Username",
          "password": "Password",
          "confirmPassword": "Confirm password",
          "active": "Active"
        },
        "button": {
          "list": "Back to list"
        }
      }
    },
    "app.compo.activityType": {
      "list": {
        "table": {
          "thead": {
            "name": "Name",
            "isWorkDay": "isWorkDay",
            "isBillDay": "isBillDay",
            "isHolidayDay": "isHolidayDay",
            "isTrainingDay": "isTrainingDay",
            "action": "Action"
          },
          "action": {
            "delete": "DELETE"
          }
        },
        "button": {
          "add": "ADD"
        }
      },
      "form": {
        "input": {
          "name": "Name",
          "isWorkDay": "isWorkDay",
          "isBillDay": "isBillDay",
          "isHolidayDay": "isHolidayDay",
          "isTrainingDay": "isTrainingDay"
        },
        "button": {
          "list": "Back to list"
        }
      }
    },
    "app.compo.activity": {
      "select": {
        "consultant": {
          "title": "Activities of my consultant"
        }
      },
      "list": {
        "table": {
          "thead": {
            "name": "Name",
            "type": "Type",
            "project": "Project",
            "client": "Client",
            "startDate": "StartDate",
            "endDate": "EndDate",
            "consultant": "Consultant",
            "valid": "Valid",
            "action": "Action"
          },
          "action": {
            "delete": "DELETE"
          }
        },
        "button": {
          "add": "ADD",
          "addMultiple": "ADD MULTI ACTIVITY"
        }
      },
      "form": {
        "input": {
          "type": "Type",
          "project": "Project",
          "startDate": "Start date",
          "endDate": "End date",
          "description": "Description",
          "files": "Files",
          "consultant": "Consultant",
          "valid": "Valid"
        },
        "button": {
          "list": "Back to list"
        }
      },
      "multiple": {
        "table": {
          "thead": {
            "activity": "Activity",
            "consultant": "Consultant",
            "startDate": "Start date",
            "endDate": "End Date",
            "actions": "Actions"
          },
          "actions": {
            "delete": "Remove"
          }
        },
        "input": {
          "consultant": "Consultant",
          "type": "Type",
          "project": "Project",
          "startDate": "Start date",
          "endDate": "End date",
          "description": "Description",
          "files": "Files",
          "hourSup": "Hour Supplementary",
          "valid": "Valid"
        },
        "hourSup": {
          "select": {
            "target": {
              "hour": "Hour",
              "saturday": "Saturday",
              "sunday": "Sunday",
              "holiday": "Holiday"
            }
          },
          "table": {
            "thead": {
              "target": "Target",
              "price": "Price",
              "percent": "%",
              "actions": "Actions"
            },
            "actions": {
              "add": "ADD"
            }
          }
        },
        "actions": {
          "add": "ADD",
          "submit": "SUBMIT"
        },
        "modal": {
          "title": "ADD MULTI ACTIVITY"
        }
      }
    },
    "app.compo.cra": {
      "list": {
        "table": {
          "thead": {
            "consultant": "Consultant",
            "month": "Month",
            "createdDate": "CreatedDate",
            "lastUpdateDate": "LastUpdateDate",
            "status": "Status",
            "action": "Action"
          },
          "action": { 
            "showDetails": "Show CRA" ,
            "showConge": "Show Conge" 
          }
        }
      }
    }
  }
  
  
  document.body.innerText = YsakON.stringify(o, 'o');

  