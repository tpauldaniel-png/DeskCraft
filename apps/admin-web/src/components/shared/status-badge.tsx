import { CircleCheck, CircleMinus, TriangleAlert, CircleX, Info, type LucideIcon } from 'lucide-react';

import {Badge} from "@/components/ui/badge";
import type { ReactNode } from 'react';

type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

type StatusBadgeProps = {
    status: StatusTone;
    children: ReactNode
};

const statusStyles : Record<StatusTone, string> = {
    "success" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    "neutral": "border-border bg-muted-foreground",
    "warning": "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",
    "danger": "border-destructive/30 bg-destructive/10 text-destructive",
    "info": "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300",
};

const statusIcons: Record<StatusTone, LucideIcon> = {
    "success": CircleCheck,
    "neutral": CircleMinus,
    "warning": TriangleAlert,
    "danger": CircleX,
    "info": Info,
};

export function StatusBadge({status, children}: StatusBadgeProps) {
    const Icon = statusIcons[status]
    return(
        <Badge variant="outline" className={statusStyles[status]}>
            <Icon data-icon="inline-start" aria-hidden="true" />
            {children}
        </Badge>
    )
}


