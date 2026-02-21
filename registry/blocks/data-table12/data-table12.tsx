"use client";

import {
  type Column,
  type ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  type SortingState,
  type Table as TableType,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCheckIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Clock,
  Footprints,
  LoaderIcon,
  Package,
  PackageIcon,
  PieChart,
  PlusCircle,
  RefreshCcw,
  Settings2,
  Shirt,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type UseDataTableOptions<TData> = {
  data: Array<TData>;
  columns: Array<ColumnDef<TData, unknown>>;
  getRowId?: (row: TData) => string;
  initialSorting?: SortingState;
  initialGlobalFilter?: string;
  initialFilters?: ColumnFiltersState;
  initialVisibility?: VisibilityState;
  initialSelection?: RowSelectionState;
  enableRowSelection?: boolean;
};

export function useDataTable<TData>(options: UseDataTableOptions<TData>) {
  const {
    data,
    columns,
    getRowId,
    initialSorting = [],
    initialFilters = [],
    initialGlobalFilter = "",
    initialVisibility = {},
    initialSelection = {},
    enableRowSelection = true,
  } = options;

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialFilters);
  const [globalFilter, setGlobalFilter] =
    React.useState<string>(initialGlobalFilter);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialVisibility);
  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>(initialSelection);

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableRowSelection,
  });

  return {
    table,
    columnFilters,
    setColumnFilters,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
  };
}

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

export const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  const canSort = column.getCanSort();
  const sorted = column.getIsSorted();

  if (!canSort) {
    return (
      <span className="flex h-8 items-center text-sm font-medium text-foreground">
        {title}
      </span>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex h-8 items-center gap-2 px-0 text-sm font-medium text-foreground"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      <span>{title}</span>
      {sorted === "desc" ? (
        <ArrowDown className="h-4 w-4" />
      ) : sorted === "asc" ? (
        <ArrowUp className="h-4 w-4" />
      ) : (
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      )}
    </Button>
  );
};

type DataTablePaginationProps<TData> = {
  table: TableType<TData>;
  pageSizeOptions?: number[];
};

export const DataTablePagination = <TData,>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: DataTablePaginationProps<TData>) => {
  const currentPage = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  const startRow = currentPage * pageSize + 1;
  const endRow = Math.min((currentPage + 1) * pageSize, totalRows);

  const relevantPageSizes = pageSizeOptions.filter(
    (size) => size <= totalRows || size === pageSize,
  );

  return (
    <div className="flex flex-col gap-4 px-2 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 text-center text-sm text-muted-foreground sm:text-left">
        <span className="font-medium">
          {totalRows === 0 ? (
            "No results"
          ) : (
            <>
              Showing {startRow} to {endRow} of {totalRows}{" "}
              {totalRows === 1 ? "row" : "rows"}
            </>
          )}
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium whitespace-nowrap">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            disabled={totalRows === 0}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {relevantPageSizes.map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium whitespace-nowrap">
            Page {currentPage + 1} of {pageCount}
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={currentPage === 0 || totalRows === 0}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={currentPage === pageCount - 1 || totalRows === 0}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DataTableViewOptionsProps<TData> {
  table: TableType<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const columns = table.getAllColumns().filter((column) => column.getCanHide());

  const hiddenCount = columns.filter((col) => !col.getIsVisible()).length;
  const hasHiddenColumns = hiddenCount > 0;

  const handleResetColumns = () => {
    table.resetColumnVisibility();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <Settings2 className="h-4 w-4" />
          <span className="hidden sm:inline">View</span>
          {hasHiddenColumns && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {hiddenCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Toggle columns</span>
          {hasHiddenColumns && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetColumns}
              className="h-auto p-1 text-xs"
            >
              Reset
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            No columns available
          </div>
        ) : (
          columns.map((column) => {
            // Get label from meta or fallback to formatted column.id
            const label =
              (column.columnDef.meta as { label?: string })?.label ||
              column.id.charAt(0).toUpperCase() +
                column.id.slice(1).replace(/([A-Z])/g, " $1");

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                className="capitalize"
              >
                {label}
              </DropdownMenuCheckboxItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-[4px] border",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input [&_svg]:invisible",
                      )}
                    >
                      <Check className="size-3.5 text-primary-foreground" />
                    </div>
                    {option.icon && (
                      <option.icon className="size-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs text-muted-foreground">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: TableType<TData>;
  showViewOptions?: boolean;
}

export const DataTableToolbar = <TData,>({
  table,
  children,
  className,
  showViewOptions = true,
  ...props
}: DataTableToolbarProps<TData>) => {
  return (
    <div
      className={cn(
        "flex flex-row items-center justify-between gap-2 py-4",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      <div className="mb-auto flex sm:mb-0 sm:items-center">
        {showViewOptions && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
};

export const schema = z.object({
  id: z.string(),
  purchased: z.string(),
  order_status: z.string(),
  customer: z.string(),
  payment_method: z.string(),
  payment_status: z.string(),
  items: z.number(),
});

const data = [
  {
    id: "#301456",
    purchased: "Leather Jacket",
    order_status: "Ready for pickup",
    customer: "Sarah Johnson",
    payment_method: "****7321",
    payment_status: "Paid",
    items: 3,
  },
  {
    id: "#789123",
    purchased: "Blue Sneakers",
    order_status: "Fulfilled",
    customer: "Michael Brown",
    payment_method: "****4509",
    payment_status: "Paid",
    items: 2,
  },
  {
    id: "#654321",
    purchased: "Red Hoodie",
    order_status: "Fulfilled",
    customer: "Emily Davis",
    payment_method: "****9812",
    payment_status: "Pending",
    items: 4,
  },
  {
    id: "#987654",
    purchased: "Black Sunglasses",
    order_status: "Unfulfilled",
    customer: "David Lee",
    payment_method: "****6734",
    payment_status: "Pending",
    items: 1,
  },
  {
    id: "#432187",
    purchased: "Green Backpack",
    order_status: "Fulfilled",
    customer: "Lisa Wang",
    payment_method: "****2901",
    payment_status: "Paid",
    items: 2,
  },
  {
    id: "#567890",
    purchased: "Silver Watch",
    order_status: "Ready for pickup",
    customer: "James Carter",
    payment_method: "****8456",
    payment_status: "Pending",
    items: 1,
  },
  {
    id: "#234567",
    purchased: "Gray Scarf",
    order_status: "Fulfilled",
    customer: "Rachel Kim",
    payment_method: "****1234",
    payment_status: "Refunded",
    items: 3,
  },
  {
    id: "#876543",
    purchased: "Purple Dress",
    order_status: "Unfulfilled",
    customer: "Thomas Allen",
    payment_method: "****5678",
    payment_status: "Partially refunded",
    items: 2,
  },
  {
    id: "#345678",
    purchased: "White Hat",
    order_status: "Ready for pickup",
    customer: "Anna Patel",
    payment_method: "****9012",
    payment_status: "Paid",
    items: 1,
  },
  {
    id: "#456789",
    purchased: "Brown Boots",
    order_status: "Fulfilled",
    customer: "Robert Singh",
    payment_method: "****3456",
    payment_status: "Paid",
    items: 4,
  },
  {
    id: "#678901",
    purchased: "Yellow Tote Bag",
    order_status: "Fulfilled",
    customer: "Sophie Turner",
    payment_method: "****7890",
    payment_status: "Pending",
    items: 2,
  },
  {
    id: "#890123",
    purchased: "Orange Gloves",
    order_status: "Unfulfilled",
    customer: "Henry Clark",
    payment_method: "****2345",
    payment_status: "Pending",
    items: 1,
  },
  {
    id: "#123456",
    purchased: "Pink Sweater",
    order_status: "Ready for pickup",
    customer: "Grace Evans",
    payment_method: "****6789",
    payment_status: "Paid",
    items: 3,
  },
  {
    id: "#543210",
    purchased: "Black Belt",
    order_status: "Fulfilled",
    customer: "Daniel Moore",
    payment_method: "****1122",
    payment_status: "Refunded",
    items: 1,
  },
  {
    id: "#765432",
    purchased: "Teal Jacket",
    order_status: "Unfulfilled",
    customer: "Olivia White",
    payment_method: "****5566",
    payment_status: "Partially refunded",
    items: 2,
  },
  {
    id: "#987012",
    purchased: "Navy Shorts",
    order_status: "Ready for pickup",
    customer: "Ethan Gray",
    payment_method: "****9900",
    payment_status: "Pending",
    items: 5,
  },
  {
    id: "#210987",
    purchased: "Gold Necklace",
    order_status: "Fulfilled",
    customer: "Megan Scott",
    payment_method: "****3344",
    payment_status: "Paid",
    items: 1,
  },
  {
    id: "#432109",
    purchased: "Olive Pants",
    order_status: "Fulfilled",
    customer: "Jacob Hill",
    payment_method: "****7788",
    payment_status: "Paid",
    items: 3,
  },
  {
    id: "#6543210",
    purchased: "Red Cap",
    order_status: "Unfulfilled",
    customer: "Chloe Young",
    payment_method: "****1122",
    payment_status: "Pending",
    items: 1,
  },
  {
    id: "#8765432",
    purchased: "Blue Jeans",
    order_status: "Ready for pickup",
    customer: "Noah Lewis",
    payment_method: "****5566",
    payment_status: "Paid",
    items: 2,
  },
  {
    id: "#109876",
    purchased: "Green Shirt",
    order_status: "Fulfilled",
    customer: "Ava King",
    payment_method: "****9900",
    payment_status: "Refunded",
    items: 4,
  },
  {
    id: "#321098",
    purchased: "Purple Skirt",
    order_status: "Unfulfilled",
    customer: "Liam Adams",
    payment_method: "****3344",
    payment_status: "Partially refunded",
    items: 1,
  },
  {
    id: "#5432109",
    purchased: "Black Wallet",
    order_status: "Ready for pickup",
    customer: "Isabella Baker",
    payment_method: "****7788",
    payment_status: "Pending",
    items: 2,
  },
  {
    id: "#7654321",
    purchased: "Yellow Scarf",
    order_status: "Fulfilled",
    customer: "Mason Green",
    payment_method: "****1122",
    payment_status: "Paid",
    items: 1,
  },
  {
    id: "#9876543",
    purchased: "White Sneakers",
    order_status: "Fulfilled",
    customer: "Ella Martinez",
    payment_method: "****5566",
    payment_status: "Paid",
    items: 3,
  },
];

export type StatusOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export const productTypes = [
  {
    value: "electronics",
    label: "Electronics",
    icon: Smartphone,
  },
  {
    value: "accessories",
    label: "Accessories",
    icon: ShoppingBag,
  },
  {
    value: "clothing",
    label: "Clothing",
    icon: Shirt,
  },
  {
    value: "footwear",
    label: "Footwear",
    icon: Footprints,
  },
  {
    value: "shoes",
    label: "Shoes",
    icon: PackageIcon,
  },
];

export const orderStatuses: StatusOption[] = [
  { label: "Fulfilled", value: "Fulfilled", icon: CheckCircle },
  { label: "Ready for pickup", value: "Ready for pickup", icon: Package },
  { label: "Unfulfilled", value: "Unfulfilled", icon: Clock },
];

export const paymentStatuses: StatusOption[] = [
  { label: "Paid", value: "Paid", icon: CheckCheckIcon },
  { label: "Pending", value: "Pending", icon: LoaderIcon },
  { label: "Refunded", value: "Refunded", icon: RefreshCcw },
  {
    label: "Partially refunded",
    value: "Partially refunded",
    icon: PieChart,
  },
];

const createStatusLookup = (options: StatusOption[]) =>
  options.reduce<Record<string, StatusOption>>((acc, option) => {
    acc[option.value] = option;
    return acc;
  }, {});

const orderStatusLookup = createStatusLookup(orderStatuses);
const paymentStatusLookup = createStatusLookup(paymentStatuses);

export const getOrderStatusMeta = (status: string) => orderStatusLookup[status];

export const getPaymentStatusMeta = (status: string) =>
  paymentStatusLookup[status];

export const getStatusVariant = (status: string) => {
  switch (status) {
    case "Fulfilled":
      return "default";
    case "Ready for pickup":
      return "secondary";
    case "Unfulfilled":
      return "outline";
    default:
      return "outline";
  }
};

export const getPaymentVariant = (status: string) => {
  switch (status) {
    case "Paid":
      return "default";
    case "Pending":
      return "secondary";
    case "Refunded":
      return "outline";
    case "Partially refunded":
      return "outline";
    default:
      return "outline";
  }
};

export const validatedData = schema.array().parse(data);

export const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-mono">{row.original.id}</div>
    ),
    enableHiding: false,
    meta: {
      label: "Order",
    },
  },
  {
    accessorKey: "purchased",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Purchased" />
    ),
    cell: ({ row }) => {
      const items = row.original.items;

      return (
        <div className="flex gap-2">
          <div className="max-w-[500px] truncate font-medium">
            {row.original.purchased}
          </div>
          {items && <Badge variant="outline">{items}</Badge>}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    meta: {
      label: "Purchased",
    },
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">{row.original.customer}</div>
    ),
    meta: {
      label: "Customer",
    },
  },
  {
    accessorKey: "order_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.order_status;
      const statusMeta = getOrderStatusMeta(status);
      const StatusIcon = statusMeta?.icon;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant={getStatusVariant(status)}
            className="gap-1 whitespace-nowrap"
          >
            {StatusIcon && <StatusIcon className="size-3" />}
            <span>{statusMeta?.label ?? status}</span>
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return true;
      }
      const rowValue = String(row.getValue(id));
      return value.includes(rowValue);
    },
    enableSorting: false,
    meta: {
      label: "Order Status",
    },
  },
  {
    accessorKey: "payment_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.payment_status;
      const statusMeta = getPaymentStatusMeta(status);
      const StatusIcon = statusMeta?.icon;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant={getPaymentVariant(status)}
            className="gap-1 whitespace-nowrap"
          >
            {StatusIcon && <StatusIcon className="size-3" />}
            <span>{statusMeta?.label ?? status}</span>
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return true;
      }
      const rowValue = String(row.getValue(id));
      return value.includes(rowValue);
    },
    enableSorting: false,
    meta: {
      label: "Payment Status",
    },
  },

  {
    accessorKey: "payment_method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.original.payment_method}</div>
    ),
    enableSorting: false,
    meta: {
      label: "Payment Method",
    },
  },
];

export const DataTable12 = () => {
  const { table } = useDataTable({
    data: validatedData,
    columns,
    getRowId: (row) => row.id.toString(),
  });

  const Toolbar = (
    <DataTableToolbar table={table}>
      <Input
        placeholder="Search everything..."
        value={(table.getState().globalFilter as string) ?? ""}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        className="h-8 w-full lg:w-[250px]"
      />
      {table.getColumn("order_status") && (
        <DataTableFacetedFilter
          column={table.getColumn("order_status")}
          title="Order Status"
          options={orderStatuses}
        />
      )}

      {table.getColumn("payment_status") && (
        <DataTableFacetedFilter
          column={table.getColumn("payment_status")}
          title="Payment Status"
          options={paymentStatuses}
        />
      )}
    </DataTableToolbar>
  );

  return (
    <section className="py-32">
      <div className="container">
        <div className="w-full">
          <div className="mb-8 text-left">
            <h2 className="text-2xl font-bold tracking-tight">
              Data Table With Faceted Filters
            </h2>
            <p className="mt-2 text-muted-foreground">
              A feature-rich data table with sorting, global filtering, hideable
              columns, faceted filters and full pagination controls with
              responsive design.
            </p>
          </div>
          {Toolbar}
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination table={table} />
        </div>
      </div>
    </section>
  );
};
