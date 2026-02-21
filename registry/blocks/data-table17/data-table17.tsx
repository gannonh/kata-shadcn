"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DraggableAttributes,
  DraggableSyntheticListeners,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Footprints,
  GripVertical,
  PackageIcon,
  Shirt,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  initialSelection?: RowSelectionState;
  enableRowSelection?: boolean;
};

export function useDataTable<TData>(options: UseDataTableOptions<TData>) {
  const {
    data,
    columns,
    getRowId,
    initialSorting = [],
    initialGlobalFilter = "",
    initialSelection = {},
    enableRowSelection = true,
  } = options;

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const [globalFilter, setGlobalFilter] =
    React.useState<string>(initialGlobalFilter);

  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>(initialSelection);

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection,
  });

  return {
    table,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
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

export const schema = z.object({
  id: z.string(),
  item: z.string(),
  type: z.string(),
  stock: z.boolean(),
  sku: z.string(),
  price: z.number(),
  availability: z.array(z.enum(["In store", "Online"])),
});

type Product = z.infer<typeof schema>;

export const data = [
  {
    id: "prod-001",
    item: "Tablet Case",
    type: "Electronics",
    stock: true,
    sku: "TC-001",
    price: 83.24,
    availability: ["In store", "Online"],
  },
  {
    id: "prod-002",
    item: "Smart Watch",
    type: "Electronics",
    stock: true,
    sku: "SW-002",
    price: 246.27,
    availability: ["In store", "Online"],
  },
  {
    id: "prod-003",
    item: "Wool Sweater",
    type: "Accessories",
    stock: true,
    sku: "WS-003",
    price: 168.27,
    availability: ["In store"],
  },
  {
    id: "prod-004",
    item: "Wireless Earbuds",
    type: "Electronics",
    stock: true,
    sku: "WE-004",
    price: 107.75,
    availability: ["In store", "Online"],
  },
  {
    id: "prod-005",
    item: "Laptop Sleeve",
    type: "Electronics",
    stock: true,
    sku: "LS-005",
    price: 248.02,
    availability: ["In store", "Online"],
  },
  {
    id: "prod-006",
    item: "Running Shoes",
    type: "Footwear",
    stock: true,
    sku: "RS-006",
    price: 208.26,
    availability: ["In store"],
  },
  {
    id: "prod-007",
    item: "Winter Jacket",
    type: "Clothing",
    stock: true,
    sku: "WJ-007",
    price: 148.06,
    availability: ["In store"],
  },
  {
    id: "prod-008",
    item: "Phone Case",
    type: "Accessories",
    stock: true,
    sku: "PC-008",
    price: 298.08,
    availability: ["In store", "Online"],
  },
  {
    id: "prod-009",
    item: "Fitness Tracker",
    type: "Clothing",
    stock: true,
    sku: "FT-009",
    price: 222.09,
    availability: ["In store"],
  },
  {
    id: "prod-010",
    item: "Sunglasses",
    type: "Accessories",
    stock: true,
    sku: "SG-010",
    price: 60.17,
    availability: ["In store"],
  },
];

export const validatedData = schema.array().parse(data);

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

export const columns: ColumnDef<Product>[] = [
  {
    id: "drag",
    header: () => <span className="sr-only">Reorder</span>,
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="SKU" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.original.sku}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "item",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Item" />
    ),

    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">
        {row.original.item}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const productType = productTypes.find(
        (type) => type.value === row.original.type.toLowerCase(),
      );

      if (!productType) {
        return null;
      }

      return (
        <div className="flex w-[120px] items-center gap-2">
          {productType.icon && (
            <productType.icon className="size-4 text-muted-foreground" />
          )}
          <span>{productType.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return true;
      }
      const rowValue = String(row.getValue(id)).toLowerCase();
      return value.some((type) => String(type).toLowerCase() === rowValue);
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="In Stock" />
    ),
    cell: ({ row }) => {
      const inStock: boolean = row.getValue("stock");
      return inStock ? "Yes" : "No";
    },
    enableSorting: false,
  },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "availability",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available In" />
    ),
    cell: ({ row }) => {
      const availability: ("In store" | "Online")[] =
        row.getValue("availability");
      return (
        <div className="flex space-x-2">
          {availability.map((location) => (
            <Badge key={location} variant="secondary">
              {location}
            </Badge>
          ))}
        </div>
      );
    },
    enableSorting: false,
  },
];

type DragHandleProps = {
  attributes: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  interactive: boolean;
};

const DragHandle = React.forwardRef<HTMLButtonElement, DragHandleProps>(
  ({ attributes, listeners, interactive }, ref) => (
    <button
      ref={ref}
      type="button"
      className="flex size-5 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors hover:border-border hover:bg-muted"
      {...(interactive ? attributes : {})}
      {...(interactive ? (listeners ?? {}) : {})}
      tabIndex={interactive ? 0 : -1}
      aria-hidden={interactive ? undefined : true}
    >
      <GripVertical className="size-3" />
      <span className="sr-only">Drag to reorder row</span>
    </button>
  ),
);

DragHandle.displayName = "DragHandle";

function SortableProductRow({
  row,
  interactive,
}: {
  row: Row<Product>;
  interactive: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.original.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        isDragging && "bg-muted/60",
        "hover:bg-muted/30 data-[state=selected]:bg-muted/40",
      )}
      data-state={row.getIsSelected() && "selected"}
    >
      {row.getVisibleCells().map((cell) => {
        const isDragCell = cell.column.id === "drag";

        return (
          <TableCell
            key={cell.id}
            className={cn("p-2", isDragCell && "w-[48px]")}
          >
            {isDragCell ? (
              <DragHandle
                attributes={attributes}
                listeners={listeners}
                interactive={interactive}
              />
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export function DataTable17() {
  const [tableData, setTableData] = React.useState(validatedData);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = React.useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) {
        return;
      }

      setTableData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
          return items;
        }

        return arrayMove(items, oldIndex, newIndex);
      });
    },
    [setTableData],
  );

  const { table } = useDataTable({
    data: tableData,
    columns,
    getRowId: (row) => row.id.toString(),
  });

  const rows = table.getRowModel().rows;

  return (
    <section className="py-32">
      <div className="container">
        <div className="w-full">
          <div className="mb-8 text-left">
            <h2 className="text-2xl font-bold tracking-tight">
              Data Table With Draggable rows
            </h2>
            <p className="mt-2 text-muted-foreground">
              A data table with minimal drag and drop rows implemented with dnd
              kit and tanstack table
            </p>
          </div>
          <div className="overflow-hidden rounded-md border">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className="px-2"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {rows.length ? (
                    <SortableContext
                      items={rows.map((row) => row.original.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {rows.map((row) => (
                        <SortableProductRow
                          key={row.id}
                          row={row}
                          interactive={isMounted}
                        />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={table.getAllColumns().length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
        </div>
      </div>
    </section>
  );
}
