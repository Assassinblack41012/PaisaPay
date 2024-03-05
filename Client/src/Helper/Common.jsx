// import Modules
import { useDispatch, useSelector } from 'react-redux' // import useDispatch hook from react-redux
import {
  updateInternetStatus,
  updateGeneralAppInfo,
  UpdateInternetStatusInGeneralInfo,
  UpdateDocumentTitleInGeneralInfo,
  UpdatePageURLInGeneralInfo,
  UpdatePageEntryTimeInGeneralInfo,
  UpdateIpAddressInGeneralInfo,
  UpdateUpAddressTypeInGeneralInfo,
  UpdateIPLocationInGeneralInfo
} from '@redux/Slices/Status' // import the action creator for updateInternetStatus

import moment from 'moment' // import moment for date formatting

// import All Required Infos
import {
  AppName,
  AppLaunchDate,
  Live_URL,
  OwnerEmail,
  OwnerLinkedIn,
  OwnerTwitter,
  OwnerYoutube,
  OwnerName,
  isDevelopmentMode,
  AppLogo,
  MiddleServer,
  ServerEngine,
  ServerFramework,
  ServerLocation,
  DeviceDetails,
  Available_Databases,
  Process_Manager,
  Web_Server_Manager
} from '@app/App_Config' // import the App Name

// Encryption Configuration
import { React } from 'react-caches' // import the Get_IP_Details function

// function to load all General Information about the application
export async function Load_General_App_Info () {
  const Updater = useDispatch() // initialize the useDispatch hook
  const InternetStatus = useSelector(state => state.InternetStatus) // initialize the useSelector hook

  const IPDetails = await (await fetch(`${Live_URL}/api/get/info/IP_Details`)).json() // Get the Current IP Details

  // Update the General App Info
  Updater(
    updateGeneralAppInfo({
      // Page Details
      PageDetails: {
        Text_Info: {
          PageTitle: document.title, // Page Title
          PageURL: window.location.href // Page URL
        },
        Time_Info: {
          PageEntryDate: moment().format('DD/MM/YYYY'), // Current Date
          PageEntryTime: moment().format('hh:mm:ss A') // Current Time
        }
      }, // Page Title
      AppDetails: {
        Static_Details: {
          App_Name: AppName, // Application Name
          App_Logo: AppLogo, // Application Logo
          App_Launch_Date: AppLaunchDate // Application Launch Date
        },
        Timing_Details: {
          ApplicationEntryDate: moment().format('DD/MM/YYYY'), // Current Date
          ApplicationEntryTime: moment().format('hh:mm:ss A') // Current Time
        }
      },
      ApplicationConfig: {
        Frontend_Details: {
          Live_URL_FOR_API_CALL: `${Live_URL}/api`, // Application Live URL
          isDevelopmentMode, // Application Development Mode
          InternetStatus // Internet Status
        },
        // Server Details
        ServerDetails: {
          DatabaseDetails: {
            CurrentDatabase: Available_Databases[Math.floor(Math.random() * Available_Databases.length)], // Current Database
            Available_Databases // Available Databases
          }, // Database
          MiddleServer, // Middle Server
          ServerLocation, // Server Location
          isServerRunning: true, // Server Status
          Web_Server_Details: {
            ServerEngine, // Server Engine
            ServerFramework, // Server Framework
            Web_Server_Manager, // Web Server Manager
            Process_Manager // Process Manager
          }
        }
      },
      OwnerDetails: {
        Owner_Social_Media: {
          Owner_LinkedIn: OwnerLinkedIn, // Application Owner LinkedIn
          Owner_Twitter: OwnerTwitter, // Application Owner Twitter
          Owner_Youtube: OwnerYoutube // Application Owner Youtube
        }, // Application Owner Social Media
        Main_Details: {
          Owner_Email: OwnerEmail, // Application Owner Email
          Owner_Name: OwnerName // Application Owner Name
        }
      },
      ClientDetails: {
        ClientDeviceDetails: DeviceDetails, // Client Device Details
        ClientIP: IPDetails.data.details.ip, // Client IP Address
        IP_Type: IPDetails.data.details.Type, // IP Type
        Client_Location: IPDetails.data.details // IP Location
      }
    })
  )
}

// Function For Change Document Title
export function Update_Document_Title (title) {
  const Updater = useDispatch() // initialize the useDispatch hook
  document.title = `${title} - ${AppName}` // Change Document Title
  Updater(UpdateDocumentTitleInGeneralInfo(title)) // Update the Document Title in General Info
  Updater(UpdatePageURLInGeneralInfo(window.location.href)) // Update the Page URL in General Info
  Updater(UpdatePageEntryTimeInGeneralInfo(moment().format('hh:mm:ss A'))) // Update the Page Entry Time in General Info
}

// function for Update the Internet Status
export async function Update_Internet_Status () {
  const Update = useDispatch() // initialize the useDispatch hook

  window.addEventListener('offline', () => {
    // add event listener for offline
    Update(updateInternetStatus(false)) // Update the Internet Status to false
    Update(UpdateInternetStatusInGeneralInfo(false)) // Update the Internet Status in General Info
  })
  window.addEventListener('online', async () => {
    const IPDetails = await (await fetch(`${Live_URL}/api/get/info/IP_Details`)).json() // Get the Current IP Details

    // add event listener for online
    Update(updateInternetStatus(true)) // Update the Internet Status to true
    Update(UpdateInternetStatusInGeneralInfo(true)) // Update the Internet Status in General Info
    Update(UpdateUpAddressTypeInGeneralInfo(IPDetails.data.Version)), // Update the IP Address Type in General Info
    Update(UpdateIpAddressInGeneralInfo(IPDetails.data.IP)), // Update the IP Address in General Info
    Update(UpdateIPLocationInGeneralInfo(IPDetails.data.Details)) // Update the IP Location in General Info
  })
} // import the encryption configuration

// Register Class Based API Call Function
export const API = new React.ClassBasedFunctions.API({
  APIBaseDomain: `${Live_URL}/api`, // API Base Domain
  Headers: {
    'Content-Type': 'application/json' // Content Type
  }
}) // API Call Function

export const FormAPI = new React.ClassBasedFunctions.API({
  APIBaseDomain: `${Live_URL}/api` // API Base Domain
}) // API Call Function
