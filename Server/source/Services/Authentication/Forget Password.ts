/* eslint-disable @typescript-eslint/no-explicit-any */
// Date Created: 9/18/2020, 10:00:00 PM
type int = number; // Define int
type str = string; // Define str

// Imports
// Import Required Modules
import { Console, Response, StatusCodes } from "outers";
import { StringKeys } from "../../settings/keys/KeysConfig.keys.settings"; // Import HTTP Status Codes
import JWT from "../../Middleware/JWT.middleware"; // Import JWT Config
import { Encrypt } from "../../Middleware/Bcrypt.middleware"; // Import Bcrypt Config
import { Request } from "express"; // Import Request from express
import { randomNumber } from "uniquegen"; // Import Uniquegen
import MongoDB from "../../settings/DB/MongoDB.db"; // Import MongoDB Instance
import { AccountExistenceChecker } from "../../utils/AC.Exist.Check.utils"; // Import Account Existence Checker

// Import Interfaces
import { ResponseInterface } from "../../utils/Incoming.Req.Check.utils"; // Import Response Interface

// Function  for forget password Account Details Sender
export const ForgetPasswordAccountFinder = async (request: Request, response: ResponseInterface) => {
	try {
		const { Email } = request.params; // Destructure the request body
		// Convert Email to lowercase
		const SmelledEmail = Email.toLowerCase(); // Convert Email to lowercase

		const AccountDetails = await MongoDB.ClientAccount.find("AND", [{ Email: SmelledEmail }], 1);

		// Check if Account Details is Empty or not
		if (AccountDetails.count === 0) {
			Response.JSON({
				status: false,
				statusCode: StatusCodes.NOT_FOUND,
				message: "Account Not Found with this Email or Phone Number",
				Title: "Account Not Found",
				data: undefined,
				response: response,
			}); // Send Response to the Client
			return;
		}
		// Encrypt the Data and send it Using JWT
		const LoginToken = await JWT.generate(
			{
				ClientID: AccountDetails.Data[0].ClientID,
				LastFourDigitsOfIDNumber: AccountDetails.Data[0].LastFourDigitsOfIDNumber,
			},
			StringKeys.JWT_EXPIRES_IN
		); // Generate Login Token for the user
		const EncryptedData = AccountDetails.Data[0]; // Encrypt the Data and send it Using JWT

		// Send Response to the Client
		Response.JSON({
			status: true,
			statusCode: StatusCodes.OK,
			message: "Account Details Matched Successfully",
			Title: "Account Details",
			data: {
				sessionID: LoginToken.toKen,
				AccountDetails: EncryptedData,
			},
			response: response,
		});
	} catch (error) {
		Console.red(error); // Log the error to the console
		Response.JSON({
			status: false,
			statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			message: "Internal Server Error",
			Title: "Internal Server Error",
			data: undefined,
			response: response,
		});
	}
};

// Interface for Forget Password Updater
interface ForgetPasswordUpdaterInterface extends Request {
	PhoneNumber: int;
	Email: str;
	Password: str;
	LastLoginIP: str;
	LastLoginClientDetails: unknown;
}
export const ForgetPasswordUpdater = async (request: Request, response: ResponseInterface) => {
	try {
		const { PhoneNumber, Email, Password, LastLoginIP, LastLoginClientDetails }: ForgetPasswordUpdaterInterface = request.body; // Destructure the request body

		// Decrypt the Data
		const DecryptEmail = Email; // Decrypt the Data
		const DecryptPhoneNumber = PhoneNumber; // Decrypt the Data
		const DecryptPassword = Password; // Decrypt the Data
		const DecryptLastLoginIP = LastLoginIP; // Decrypt the Data
		const DecryptLastLoginClientDetails = String(LastLoginClientDetails); // Decrypt the Data

		// Convert Email to lowercase
		const SmelledEmail: str = DecryptEmail.toLowerCase(); // Convert Email to lowercase

		// Encrypt the Password
		const Rounds: int = await randomNumber(1, false, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
		const EncryptedPassword: any = await Encrypt(DecryptPassword, Rounds); // Encrypt the Password

		// Find the Account in the Database
		const AccountStatus = await AccountExistenceChecker(DecryptPhoneNumber, SmelledEmail); // Find the Account in the Database

		if (AccountStatus.status === true) {
			const UpdateStatus = await MongoDB.ClientAccount.update(
				[{ Email: SmelledEmail }, { PhoneNumber: DecryptPhoneNumber }],
				{ Password: EncryptedPassword.EncryptedData },
				false
			);
			// Update Last Login IP and Last Login Client Details

			if (UpdateStatus.status === true) {
				// Encrypt the Data and send it Using JWT
				const EncryptAccountData = UpdateStatus.UpdatedData; // Encrypt the Data and send it Using JWT

				// Generate Login Token for the user
				const LoginToken = await JWT.generate(
					{
						ClientID: UpdateStatus.UpdatedData.ClientID,
						LastLoginIP: DecryptLastLoginIP,
						LastFourDigitsOfIDNumber: UpdateStatus.UpdatedData.LastFourDigitsOfIDNumber,
					},
					StringKeys.JWT_EXPIRES_IN
				); // Generate Login Token for the user

				// Update Last Login IP and Last Login Client Details
				const ToBeUpdateOptions = {
					LastLoginTime: Date.now(),
					LastLoginIP: DecryptLastLoginIP,
					LastLoginClientDetails: DecryptLastLoginClientDetails,
					LastLoginToken: LoginToken.toKen,
				}; // Options to be updated
				await MongoDB.ClientAccount.update(
					[{ PhoneNumber: DecryptPhoneNumber }, { ClientID: UpdateStatus.UpdatedData.ClientID }],
					{ $set: ToBeUpdateOptions },
					false
				);

				Response.JSON({
					status: true,
					statusCode: StatusCodes.OK,
					message: "Password Updated Successfully",
					Title: "Password Updated",
					data: {
						sessionID: LoginToken.toKen,
						AccountDetails: EncryptAccountData,
					},
					response: response,
				}); // Send Response to the Client
			}
		} else if (AccountStatus.status === false) {
			Response.JSON({
				status: false,
				statusCode: StatusCodes.NOT_FOUND,
				message: "Account Not Found with this Email or Phone Number",
				Title: "Account Not Found",
				data: undefined,
				response: response,
			}); // Send Response to the Client
		}
	} catch (error) {
		Console.red(error); // Log the error to the console
		Response.JSON({
			status: false,
			statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			message: "Internal Server Error",
			Title: "Internal Server Error",
			data: undefined,
			response: response,
		});
	}
}; // Function for forget password updater
