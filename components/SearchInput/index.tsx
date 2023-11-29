"use client";

// top level imports
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Query-string
import qs from "query-string";

// UI
import { Search } from "lucide-react";
import { Input } from "../ui/input";

// Custom hooks
import { useDebounce } from "@/hooks/use-debounce";

// component definition
export function SearchInput(): ReactElement {
    // hooks
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get("categoryId");
    const nameQuery = searchParams.get("name");

    // state definitions
    const [value, setValue] = useState(nameQuery || "");
    
    const debouncedVal = useDebounce<string>(value);

    useEffect(() => {
        const query = { name: debouncedVal, categoryId };
        const url = qs.stringifyUrl({ url: window.location.href, query }, { skipEmptyString: true, skipNull: true });
        router.push(url);
    }, [debouncedVal, router, categoryId])

    /** Handler/ Utility functions - starts */

    const onInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setValue(e.target.value)
    }

    /** Handler/ Utility functions - ends */
    // main renderer
    return (
        <div className="relative">
            <Search className="absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
            <Input
                onChange={onInputChange}
                value={value}
                placeholder="Search..."
                className="pl-10 bg-primary/10"
            />
        </div>
    )
}
