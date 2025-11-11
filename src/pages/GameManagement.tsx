import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Loader2 } from "lucide-react";
import axiosInstance from '../utils/axiosInstance';

interface Game {
    GameId: string;
    Name: string;
    PlayersCount: number;
    CommunitiesCount: number;
    CreatedAtUtc: string;
    IsDeleted: boolean;
}

interface GamesResponse {
    Items: Game[];
}

export default function GameManagement() {

    const { data, isLoading, error } = useQuery<GamesResponse>({
        queryKey: ['games'],
        queryFn: () => axiosInstance.get(`/admin/dashboard/games`).then(res => res.data),
        keepPreviousData: true, // Smooth pagination
    });

    const games = data?.Items || []; // ✅ Extract Items

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">Failed to load games</div>;
    }

    return (
        <Card className="m-6 p-6 shadow-lg">
            <CardContent>
                <h2 className="text-2xl font-semibold mb-4">🎮 Games Overview</h2>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Game Name</TableHead>
                            <TableHead>Players</TableHead>
                            <TableHead>Communities</TableHead>
                            <TableHead>Created Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {games.map((game) => (
                            <TableRow key={game.GameId}>
                                <TableCell className="font-medium">{game.Name}</TableCell>
                                <TableCell>{game.PlayersCount}</TableCell>
                                <TableCell>{game.CommunitiesCount}</TableCell>
                                <TableCell>{new Date(game.CreatedAtUtc).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {game.IsDeleted ? (
                                        <span className="text-red-500 font-semibold">Deleted</span>
                                    ) : (
                                        <span className="text-green-600 font-semibold">Active</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
