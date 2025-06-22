"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Filter,
  Search,
  XCircle,
  Calendar as CalendarIcon,
  Loader,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";

interface AlertItem {
  _id: string;
  createdAt: string;
  from?: { _id?: string; name?: string };
  to?: { _id?: string; name?: string };
  message: string;
  file?: string[];
  status: "sent" | "read";
}

interface RequestListProps {
  alertsData: AlertItem[] | undefined;
  isLoadingAlerts: boolean;
  userRole: string | null;
  onApprove: (id: string) => void;
  currentUserData?: {
    _id: string;
    worksAt: string;
    role: { name: string };
    woredaOffice?: string;
  };
  onDateFilterChange: (start: Date | undefined, end: Date | undefined) => void;
  appliedStartDate?: Date;
  appliedEndDate?: Date;
  selectedReqId: string | null;
  isApproving: boolean;
}

export function Request({
  alertsData,
  isLoadingAlerts,
  userRole,
  onApprove,
  currentUserData,
  onDateFilterChange,
  appliedStartDate,
  appliedEndDate,
  isApproving,
  selectedReqId,
}: RequestListProps) {
  const { t } = useTranslation();

  const [sentAlerts, setSentAlerts] = useState<AlertItem[]>([]);
  const [receivedAlerts, setReceivedAlerts] = useState<AlertItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!alertsData || !currentUserData?.worksAt) return;

    // Sorting function: latest date first
    const sortByDate = (a: AlertItem, b: AlertItem) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending order (latest at top)
    };

    // Sorting function: 'sent' before 'read' (secondary sort if dates are equal)
    const sortByStatus = (a: AlertItem, b: AlertItem) => {
      const order: Record<AlertItem["status"], number> = { sent: 1, read: 2 };
      return (order[a.status] ?? 99) - (order[b.status] ?? 99);
    };

    const sent = alertsData.filter(
      (alert) => alert.from?._id === currentUserData.worksAt
    );
    const received = alertsData.filter(
      (alert) => alert.to?._id === currentUserData.worksAt
    );

    // Apply sorting: First by date, then by status if dates are identical
    setSentAlerts(
      [...sent].sort((a, b) => {
        const dateComparison = sortByDate(a, b);
        if (dateComparison === 0) {
          return sortByStatus(a, b);
        }
        return dateComparison;
      })
    );

    setReceivedAlerts(
      [...received].sort((a, b) => {
        const dateComparison = sortByDate(a, b);
        if (dateComparison === 0) {
          return sortByStatus(a, b);
        }
        return dateComparison;
      })
    );
  }, [alertsData, currentUserData, appliedEndDate, appliedStartDate]); // Re-run effect when these dependencies change

  const filterAlerts = (alerts: AlertItem[]) => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.from?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.to?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchText.toLowerCase());

      const matchesDate =
        (!appliedStartDate || new Date(alert.createdAt) >= appliedStartDate) &&
        (!appliedEndDate || new Date(alert.createdAt) <= appliedEndDate);

      return matchesSearch && matchesDate;
    });
  };

  const filteredSentAlerts = useMemo(
    () => filterAlerts(sentAlerts),
    [sentAlerts, searchText, appliedStartDate, appliedEndDate]
  );
  const filteredReceivedAlerts = useMemo(
    () => filterAlerts(receivedAlerts),
    [receivedAlerts, searchText, appliedStartDate, appliedEndDate]
  );

  const handleClearFilters = () => {
    setSearchText("");
    setStartDate(undefined);
    setEndDate(undefined);
    onDateFilterChange(undefined, undefined);
  };

  const handleApplyDateFilters = () => {
    onDateFilterChange(startDate, endDate);
  };

  const isAnyFilterApplied = searchText || appliedStartDate || appliedEndDate;

  if (isLoadingAlerts) {
    return <div>{t("loadingRequests")}</div>;
  }

  return (
    <Tabs defaultValue="received" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <TabsList>
          <TabsTrigger value="sent">{t("sentRequests")}</TabsTrigger>
          <TabsTrigger value="received">{t("receivedRequests")}</TabsTrigger>
        </TabsList>
        <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchRequests")}
              className="w-full pl-8"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-start font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : t("Start Date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-start font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : t("End Date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            onClick={handleApplyDateFilters}
            disabled={!startDate && !endDate}
          >
            <Filter className="mr-2 h-4 w-4" />
            {t("apply")}
          </Button>

          {isAnyFilterApplied && (
            <Button variant="outline" onClick={handleClearFilters}>
              <XCircle className="mr-2 h-4 w-4" />
              {t("clear")}
            </Button>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {appliedStartDate || appliedEndDate
          ? `Showing requests from ${
              appliedStartDate
                ? format(appliedStartDate, "PPP")
                : "the beginning"
            } to ${appliedEndDate ? format(appliedEndDate, "PPP") : "now"}`
          : "Showing all requests"}
      </div>

      <TabsContent value="sent">
        <Card>
          <CardHeader>
            <CardTitle>{t("sentRequests")}</CardTitle>
            <CardDescription>
              {t("viewSentRequests")} ({filteredSentAlerts.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  {/* <TableHead>{t("from")}</TableHead> */}
                  <TableHead>{t("to")}</TableHead>
                  <TableHead>{t("message")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSentAlerts.length > 0 ? (
                  filteredSentAlerts.map((alert) => (
                    <TableRow key={alert._id}>
                      <TableCell>
                        {new Date(alert.createdAt).toLocaleString()}
                      </TableCell>
                      {/* <TableCell>{alert.from?.name || t("n/a")}</TableCell> */}
                      <TableCell>{alert.to?.name || t("n/a")}</TableCell>
                      <TableCell>
                        {alert.message}
                        {(alert.file?.length ?? 0) > 0 && (
                          <div className="mt-1">
                            {alert.file?.map((fileUrl, index) => (
                              <a
                                key={index}
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="text-blue-600 underline mr-2"
                              >
                                {t("downloadPdf")}
                              </a>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            alert.status === "sent"
                              ? "bg-yellow-100 text-yellow-800"
                              : alert.status === "read"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {t(alert.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {isAnyFilterApplied
                        ? t("noMatchingRequests")
                        : t("noRequestsFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="received">
        <Card>
          <CardHeader>
            <CardTitle>{t("receivedRequests")}</CardTitle>
            <CardDescription>
              {t("viewReceivedRequests")} ({filteredReceivedAlerts.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead>{t("from")}</TableHead>
                  {/* <TableHead>{t("to")}</TableHead> */}
                  <TableHead>{t("message")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceivedAlerts.length > 0 ? (
                  filteredReceivedAlerts.map((alert) => (
                    <TableRow key={alert._id}>
                      <TableCell>
                        {new Date(alert.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{alert.from?.name || t("n/a")}</TableCell>
                      {/* <TableCell>{alert.to?.name || t("n/a")}</TableCell> */}
                      <TableCell>
                        {alert.message}
                        {(alert.file?.length ?? 0) > 0 && (
                          <div className="mt-1">
                            {alert.file?.map((fileUrl, index) => (
                              <a
                                key={index}
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="text-blue-600 underline mr-2"
                              >
                                {t("downloadPdf")}
                              </a>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            alert.status === "sent"
                              ? "bg-yellow-100 text-yellow-800"
                              : alert.status === "read"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {t(alert.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {alert.status === "sent" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                            onClick={() => onApprove(alert._id)}
                          >
                            {isApproving && selectedReqId === alert._id ? (
                              <Loader />
                            ) : (
                              t("approve")
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      {isAnyFilterApplied
                        ? t("noMatchingRequests")
                        : t("noRequestsFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}