import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { TableSkeleton } from "../components/ui/TableSkeleton";
import { Loader2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance.ts";

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
    queryKey: ["games"],
    queryFn: () =>
      axiosInstance.get(`/admin/dashboard/games`).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const games = data?.Items || []; // ✅ Extract Items

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">Failed to load games</div>
    );
  }

  return (
    <Card className="m-6 p-6 shadow-lg">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">🎮 Games Overview</h2>
            {isLoading && (
              <div className="mt-2 h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            )}
          </div>
          {isLoading && (
            <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
          )}
        </div>

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
            {isLoading ? (
              <TableSkeleton rows={5} columns={5} />
            ) : games.length === 0 ? (
              <TableRow>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No games available.
                </td>
              </TableRow>
            ) : (
              games.map((game) => (
                <TableRow key={game.GameId}>
                  <TableCell className="font-medium">{game.Name}</TableCell>
                  <TableCell>{game.PlayersCount}</TableCell>
                  <TableCell>{game.CommunitiesCount}</TableCell>
                  <TableCell>
                    {new Date(game.CreatedAtUtc).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {game.IsDeleted ? (
                      <span className="text-red-500 font-semibold">
                        Deleted
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
