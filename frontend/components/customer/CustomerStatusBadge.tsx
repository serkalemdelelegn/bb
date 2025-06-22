import { CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CustomerStatusBadgeProps {
  status: string;
}

export default function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  const { t } = useTranslation();
  const isAvailable = status === "available";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isAvailable
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {isAvailable ? (
        <CheckCircle className="mr-1 h-3 w-3" />
      ) : (
        <XCircle className="mr-1 h-3 w-3" />
      )}
      {isAvailable ? t("available") : t("taken")}
    </span>
  );
}
