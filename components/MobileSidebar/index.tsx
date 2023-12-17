// top level imports
import { ReactElement } from "react"

// UI
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sidebar } from "../Sidebar"

// props type definition
interface IProps {
    hasProSubscription: boolean | undefined
}

// Component definition
export function MobileSidebar({ hasProSubscription }: IProps): ReactElement {

    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4">
                <Menu />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-secondary pt-10 w-32">
                <Sidebar hasProSubscription={hasProSubscription} />
            </SheetContent>
        </Sheet>
    )
}