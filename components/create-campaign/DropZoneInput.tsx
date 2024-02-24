import { cn } from "@/lib";
import { acceptedFilesString, validateFiles } from "@/lib/helpers/campaign";
import { useToggle } from "@/lib/hooks";
import { useFormStore } from "@/store/formStore";
import type { ChangeEvent, DragEvent } from "react";
import { toast } from "sonner";
import { Button } from "../ui";

type DropZoneInputProps = {
	value: File[];
	onChange: (files: File[]) => void;
};

function DropZoneInput(props: DropZoneInputProps) {
	const { value: imageFiles, onChange } = props;

	const [isDragActive, toggleIsDragActive] = useToggle(false);

	const { setData } = useFormStore((state) => state.actions);

	const handleImageUpload = (
		event: ChangeEvent<HTMLInputElement> | DragEvent<HTMLDivElement>
	) => {
		event.type === "drop" && toggleIsDragActive(false);

		const fileList =
			event.type === "drop"
				? (event as DragEvent).dataTransfer.files
				: (event as ChangeEvent<HTMLInputElement>).target.files;

		if (fileList === null) {
			toast.error("Error", {
				description: "No file selected",
			});

			return;
		}

		const validFilesArray = validateFiles(fileList, imageFiles);

		if (validFilesArray.length === 0) return;

		const newFileState = [...imageFiles, ...validFilesArray];

		setData({ step: 3, data: { photos: newFileState } });

		onChange(newFileState);
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		toggleIsDragActive(true);
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		toggleIsDragActive(false);
	};

	return (
		<div
			onDrop={handleImageUpload}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			className={cn(
				"mt-@1.6 borderabeg-primary py-@1.5 relative flex min-h-40 flex-col items-center justify-end rounded-[5px] border border-dashed text-xs lg:min-h-60",
				isDragActive && "opacity-60"
			)}
		>
			<Button
				variant="primary"
				className="p-@0.8 lg:px-@2.6 lg:py-@1.3 rounded-md bg-abeg-primary text-xs font-bold lg:rounded-lg lg:text-base"
				type="button"
			>
				Upload
			</Button>

			<input
				className="absolute inset-0 cursor-pointer opacity-0"
				type="file"
				accept={acceptedFilesString}
				onChange={handleImageUpload}
				multiple
			/>

			<div className="mt-@1.5 text-center text-xs lg:text-xs">
				<p className="italic text-abeg-primary">
					Click to select files, or Drag {`'n'`} Drop
				</p>

				<p className="mt-@0.3">Support files; PDF, JPG, CSV </p>

				<p className="text-abeg-green">Not more than 5mb</p>
			</div>
		</div>
	);
}

export default DropZoneInput;