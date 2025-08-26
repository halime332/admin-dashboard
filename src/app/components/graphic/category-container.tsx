import { FC } from "react";
import DoughnutGraph from "./doughnut-graph";
import { getProducts } from "@/app/utils/service";

const CategoryContainer: FC = async () => {
    const products = await getProducts();

    //kategori isimlarinden  benzersiz bir dizi oluştur
    const labels = [...new Set(products.map((item) => item.category))];

    //her kategoride kaç ürün olduğunu verisini bir nesnede tut
    const object: Record<string, number> = {};

    products.forEach((item) => {
        object[item.category] = (object[item.category] || 0) + 1;
    });

    const values = Object.values(object);

    return (
        <div className='mt-10 bg-white rounded-lg p-5 w-full h-full '>
            <h2 className="font-semibold text-lg mb-4">Kategori Dağılımı</h2>

            <DoughnutGraph labels={labels} values={values} />
        </div>
    );
};

export default CategoryContainer;