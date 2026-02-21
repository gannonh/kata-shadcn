"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Cell,
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Header,
  RowSelectionState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Footprints,
  GripVerticalIcon,
  PackageIcon,
  Shirt,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import * as React from "react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  initialColumnOrder?: string[];
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
    initialColumnOrder = [],
    enableRowSelection = true,
  } = options;

  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);

  const [globalFilter, setGlobalFilter] =
    React.useState<string>(initialGlobalFilter);

  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>(initialSelection);

  const [columnOrder, setColumnOrder] =
    React.useState<string[]>(initialColumnOrder);

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting,
      globalFilter,
      rowSelection,
      columnOrder,
    },
    columnResizeMode: "onChange",
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnOrderChange: setColumnOrder,
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
    columnOrder,
    setColumnOrder,
  };
}

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
  columnId: string;
  columnOrder: string[];
  onMoveColumn: (columnId: string, direction: "left" | "right") => void;
};

export const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  columnId,
  columnOrder,
  onMoveColumn,
}: DataTableColumnHeaderProps<TData, TValue>) => {
  const canSort = column.getCanSort();
  const sorted = column.getIsSorted();
  const currentIndex = columnOrder.indexOf(columnId);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === columnOrder.length - 1;

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="truncate text-sm font-medium">{title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 hover:bg-muted"
          >
            {sorted === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : sorted === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          {canSort && (
            <>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(false)}
                className="flex items-center gap-2"
              >
                <ArrowUp className="h-4 w-4" />
                <span>Asc</span>
                {sorted === "asc" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => column.toggleSorting(true)}
                className="flex items-center gap-2"
              >
                <ArrowDown className="h-4 w-4" />
                <span>Desc</span>
                {sorted === "desc" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            onClick={() => onMoveColumn(columnId, "left")}
            disabled={isFirst}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Move to Left</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onMoveColumn(columnId, "right")}
            disabled={isLast}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            <span>Move to Right</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
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
    id: "sku",
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => <div className="w-[80px]">{row.original.sku}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "item",
    accessorKey: "item",
    header: "Item",
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">
        {row.original.item}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
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
    enableSorting: true,
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return true;
      }
      const rowValue = String(row.getValue(id)).toLowerCase();
      return value.some((type) => String(type).toLowerCase() === rowValue);
    },
  },
  {
    id: "stock",
    accessorKey: "stock",
    header: "In Stock",
    cell: ({ row }) => {
      const inStock: boolean = row.getValue("stock");
      return inStock ? "Yes" : "No";
    },
    enableSorting: true,
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return <div className="font-medium">{formatted}</div>;
    },
    enableSorting: true,
  },
  {
    id: "availability",
    accessorKey: "availability",
    header: "Available In",
    cell: ({ row }) => {
      const availability: ("In store" | "Online")[] =
        row.getValue("availability");
      return (
        <div className="flex gap-2">
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

const DraggableTableHeader = ({
  header,
  interactive,
  columnOrder,
  onMoveColumn,
}: {
  header: Header<Product, unknown>;
  interactive: boolean;
  columnOrder: string[];
  onMoveColumn: (columnId: string, direction: "left" | "right") => void;
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: header.column.id,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.7 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableHead
      ref={setNodeRef}
      className="relative h-10 border-t before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-border first:before:bg-transparent"
      style={style}
    >
      <div className="flex items-center gap-2">
        {interactive && (
          <button
            type="button"
            className="flex size-5 shrink-0 cursor-grab items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="opacity-70" size={14} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          {header.isPlaceholder ? null : typeof header.column.columnDef
              .header === "string" ? (
            <DataTableColumnHeader
              column={header.column}
              title={header.column.columnDef.header}
              columnId={header.column.id}
              columnOrder={columnOrder}
              onMoveColumn={onMoveColumn}
            />
          ) : (
            flexRender(header.column.columnDef.header, header.getContext())
          )}
        </div>
      </div>
    </TableHead>
  );
};

const DraggableRowCell = ({ cell }: { cell: Cell<Product, unknown> }) => {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.7 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
    transition,
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableCell ref={setNodeRef} className="truncate" style={style}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

export function DataTable19() {
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

  const { table, setColumnOrder, columnOrder } = useDataTable({
    data: validatedData,
    columns,
    getRowId: (row) => row.id.toString(),
    initialColumnOrder: columns.map((column) => column.id as string),
  });

  const handleDragEnd = React.useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!active || !over || active.id === over.id) {
        return;
      }

      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);

        if (oldIndex === -1 || newIndex === -1) {
          return columnOrder;
        }

        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    },
    [setColumnOrder],
  );

  const handleMoveColumn = React.useCallback(
    (columnId: string, direction: "left" | "right") => {
      setColumnOrder((currentOrder) => {
        const currentIndex = currentOrder.indexOf(columnId);
        if (currentIndex === -1) return currentOrder;

        const newIndex =
          direction === "left" ? currentIndex - 1 : currentIndex + 1;

        // Bounds check
        if (newIndex < 0 || newIndex >= currentOrder.length) {
          return currentOrder;
        }

        return arrayMove(currentOrder, currentIndex, newIndex);
      });
    },
    [setColumnOrder],
  );

  const rows = table.getRowModel().rows;

  return (
    <section className="py-32">
      <div className="container">
        <div className="w-full">
          <div className="mb-8 text-left">
            <h2 className="text-2xl font-bold tracking-tight">
              Data Table With Draggable and Controllable Columns
            </h2>
            <p className="mt-2 text-muted-foreground">
              A data table with draggable column reordering and dropdown
              controls for sorting and moving columns
            </p>
          </div>
          <div className="overflow-hidden rounded-md border">
            <DndContext
              id={React.useId()}
              sensors={sensors}
              collisionDetection={closestCenter}
              modifiers={[restrictToHorizontalAxis]}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      <SortableContext
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        {headerGroup.headers.map((header) => (
                          <DraggableTableHeader
                            key={header.id}
                            header={header}
                            interactive={isMounted}
                            columnOrder={columnOrder}
                            onMoveColumn={handleMoveColumn}
                          />
                        ))}
                      </SortableContext>
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {rows?.length ? (
                    rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-muted/30 data-[state=selected]:bg-muted/40"
                      >
                        <SortableContext
                          items={columnOrder}
                          strategy={horizontalListSortingStrategy}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <DraggableRowCell key={cell.id} cell={cell} />
                          ))}
                        </SortableContext>
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
            </DndContext>
          </div>
        </div>
      </div>
    </section>
  );
}
