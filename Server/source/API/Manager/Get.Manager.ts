import { Router } from 'express'; // Import Router from express
import CORS from 'cors'; // Import CORS from cors
import { StringKeys } from '../../settings/keys/keys'; // Import StringKeys from keys

// Import All Sub Service Routes
import AccountDetails from '../Routers/GET/Account.Details.Route'; // Import Account Details
import Authenticator from '../Routers/GET/Authentication.Route'; // Import Authentication
import HelpCenter from '../Routers/GET/Help.Center.Route'; // Import Help Center

// Setup Config
const Get_Request_Manager = Router(); // Setup Get_Request_Manager as Router
Get_Request_Manager.use(CORS({ origin: StringKeys.CORS_URL })); // Use CORS

// All Sub Routes
Get_Request_Manager.use('/AccountDetails', AccountDetails); // Use Account Details
Get_Request_Manager.use('/Auth', Authenticator); // Use Account Details
Get_Request_Manager.use('/help', HelpCenter); // Use Help Center

// Export Get_Request_Manager
export default Get_Request_Manager;