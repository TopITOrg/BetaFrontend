import {Button} from "@/components/ui/button";

function CustomButton({
                          text,
                          isSelected = false,
                          width, // Опциональный параметр
                          ...props
                      }: {
    text: string;
    isSelected: boolean;
    width?: string; // Опциональный параметр для ширины
} & React.ComponentProps<typeof Button>) {

    const baseClasses = "rounded-xl border-2 font-bold transition-colors duration-400 ease-in-out h-[40px]";

    const selectedClasses = isSelected
        ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 hover:text-white"
        : "bg-white text-blue-500 border-blue-500 hover:bg-gray-200 hover:text-blue-500 hover:border-blue-500";

    return (
        <Button
            variant="outline"
            style={width ? { width } : undefined} // Устанавливаем ширину только если передан параметр
            className={`${baseClasses} ${selectedClasses}`}
            {...props}
        >
            {text}
        </Button>
    );
}
export { CustomButton };