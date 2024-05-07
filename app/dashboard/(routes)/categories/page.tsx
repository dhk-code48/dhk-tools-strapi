import prismadb from "@/lib/prismadb";
import moment from "moment";
import { CategoryColumn } from "./_components/columns";
import { CategoriesClient } from "./_components/client";

const CategoriesPage = async ({ params }: { params: { schoolId: string } }) => {
  const categories = await prismadb.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: moment(item.createdAt).format("MMMM Do YYYY").toString(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
