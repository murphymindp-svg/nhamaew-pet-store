import clsx, { ClassValue } from "clsx";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertDateToThai(
	dateInput: Date | string,
	dateFormat: string = "dd MMMM yyyy",
	isBC: boolean = true
) {
	if (!dateInput) return "";

	const date =
		typeof dateInput === "string" ? new Date(dateInput) : dateInput;
	if (isNaN(date.getTime())) return "";

	const formatDate = format(date, dateFormat, { locale: th });

	if (isBC) {
		const yearBE = date.getFullYear() + 543;
		const formattedDate = formatDate.replace(
			/(\d{4})(?!.*\d{4})/,
			String(yearBE)
		);
		return dateFormat == "dd MMM yyyy HH:mm"
			? `${formattedDate} น.`
			: formattedDate;
	}

	return formatDate;
}
