import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const sweetalert = withReactContent(Swal);

export const swal = sweetalert.mixin({
	allowOutsideClick: false,
	buttonsStyling: false,
	confirmButtonText: "ตกลง",
	cancelButtonText: "ยกเลิก",
	denyButtonText: "ไม่ใช่",
	customClass: {
		popup: "!rounded-2xl !pb-8 !px-8",
		title: "!text-base font-semibold",
		htmlContainer: "!text-sm !text-subdude",
		actions: "flex flex-col justify-center items-center gap-y-4 !w-full",
		cancelButton:
			"px-4 py-2 !text-base !font-semibold w-full bg-secondary border border-secondary text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0-pointer",
		confirmButton:
			"px-4 py-2 !text-base !font-semibold w-full bg-primary border border-primary text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
		denyButton:
			"px-4 py-2 !text-base !font-semibold w-full bg-secondary border border-secondary text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0-pointer",
	},
});