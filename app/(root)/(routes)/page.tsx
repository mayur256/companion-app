// top level imports
import { ReactElement } from "react";

// UI
import { SearchInput } from "@/components/SearchInput";

export default function Home(): ReactElement {
    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />
        </div>
    )
}
