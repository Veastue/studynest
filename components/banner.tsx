import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertTriangle, CheckCircleIcon } from "lucide-react"


const bannerVariants = cva(
    "border text-center p-4  text-sm flex items-center",
    {
        variants: {
            variant: {
                warning: "bg-yellow-200/80 border-yellow-300 text-primary",
                success: "bg-teal-700 border-teal-800 text-secondary dark:text-white"
            }
        },
        defaultVariants: {
            variant: "warning"
        }
    }
)

interface BannerProps extends VariantProps<typeof bannerVariants>{
    label: string
}

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircleIcon
}

export const Banner = ({
    label,
    variant
}: BannerProps) => {
    const Icon = iconMap[variant || "warning"];
    return (
        <div className={cn(bannerVariants({variant}), )}>
            <Icon className='h-4 w-4 mr-2'/>
            {label}
        </div>
    )
}