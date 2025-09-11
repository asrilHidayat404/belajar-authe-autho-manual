import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

type RabData = Array<Array<string | number | null>>;

export const RabTable = ({ data }: { data: RabData }) => {

    // Extract headers from first row
    const headers = data[0] as string[];


    // Extract items (skip header and total rows)
    const items = data.slice(1, -1) as Array<[number, string, number, number, number]>;

    // Extract total from last row (last element)
    const total = items.reduce((sum, item) => sum + (item[4] ?? 0), 0);


    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <ScrollArea className="h-72 w-full rounded-md border">
                    <TableHeader>
                        <TableRow>
                            {headers?.map((header, index) => (
                                <TableHead key={index} className={index >= 2 ? 'text-right' : ''}>
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {items?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item[0]}</TableCell>
                                <TableCell className="font-medium">{item[1]}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item[2])}</TableCell>
                                <TableCell className="text-right">{item[3]}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(item[4])}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={4} className="text-right font-medium">
                                Total
                            </TableCell>
                            <TableCell className="text-right font-bold">
                                <Badge variant="outline" className="px-4 py-2 text-base">
                                    {formatCurrency(total)}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    </TableBody >
                </ScrollArea>
            </Table >
        </div >
    );
};

export function ExampleRabTable({ data }) {
    return <RabTable data={data} />;
}
