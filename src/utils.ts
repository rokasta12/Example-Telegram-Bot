import axios from "axios";
import { createWriteStream } from "fs";

export async function downloadFile(
	fileUrl: string,
	outputLocationPath: string
) {
	const writer = createWriteStream(outputLocationPath);

	return axios({
		method: "get",
		url: fileUrl,
		responseType: "stream",
	}).then((response) => {
		return new Promise((resolve, reject) => {
			response.data.pipe(writer);
			let error: any = null;
			writer.on("error", (err) => {
				error = err;
				writer.close();
				reject(err);
			});
			writer.on("close", () => {
				if (!error) {
					resolve(true);
				}
			});
		});
	});
}

export const formState: any = {};
const formKeys = ["title", "description"];

export const saveFormDataForSubmission = (data: {
	userID: number;
	message: string;
}) => {
	const { userID } = data;
	if (!(userID in formState)) {
		formState[userID] = {};
	}
	const keyCurr = checkCurrentStateOfUser(userID);

	if (userID in formState) {
		formState[userID][keyCurr] = data.message;
	}
	return keyCurr;
};
const checkCurrentStateOfUser = (userID: number) => {
	// formKeys'den hangisini tamamlamış en son
	for (let index = 0; index < formKeys.length; index++) {
		const key = formKeys[index];
		if (key in formState[userID]) {
		} else {
			// this is the key that user should fill
			return key;
		}
	}
	return "finished";
};
