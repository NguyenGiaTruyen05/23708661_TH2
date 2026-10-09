import { PRICE_MULTIPLIER } from '@constants/student';
import { apiClient } from '@services/apiClient';

export type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    category: string;
};

type FakeStoreProduct = {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
};

const KTXGO_PRICES: Record<number, number> = {
    1: 35000,
    2: 25000,
    3: 18000,
    4: 10000,
    5: 15000,
    6: 20000,
    7: 22000,
    8: 18000,
    9: 30000,
    10: 22000,
    11: 35000,
    12: 18000,
};

const KTX_PRODUCTS: Record<
    number,
    {
        title: string;
        description: string;
        category: string;
        image: string;
    }
> = {
    1: {
        title: 'Cơm gà sốt tiêu',
        description: 'Cơm nóng kèm gà mềm và sốt tiêu đậm đà.',
        category: 'Đồ ăn',
        image:
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    },

    2: {
        title: 'Trà sữa trân châu',
        description: 'Trà sữa thơm béo, kèm trân châu dai ngon.',
        category: 'Nước uống',
        image:
            'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600',
    },

    3: {
        title: 'Mì ly bò cay',
        description:
            'Mì ly nóng, vị bò cay phù hợp cho bữa tối ký túc xá.',
        category: 'Đồ ăn',
        image:
            'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600',
    },

    4: {
        title: 'Nước suối 500ml',
        description: 'Nước suối đóng chai tiện lợi cho sinh viên.',
        category: 'Nước uống',
        image:
            'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600',
    },

    5: {
        title: 'Bánh mì thịt',
        description:
            'Bánh mì giòn với thịt, rau và nước sốt đặc trưng.',
        category: 'Đồ ăn',
        image:
            'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
    },

    6: {
        title: 'Cà phê sữa đá',
        description:
            'Cà phê đậm vị kết hợp sữa và đá mát lạnh.',
        category: 'Nước uống',
        image:
            'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600',
    },

    7: {
        title: 'Cơm nắm cá ngừ',
        description:
            'Cơm nắm tiện lợi, thích hợp ăn nhanh giữa giờ học.',
        category: 'Đồ ăn',
        image:
            'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=600',
    },

    8: {
        title: 'Nước cam',
        description:
            'Nước cam mát lạnh, vị cam dễ uống.',
        category: 'Nước uống',
        image:
            'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600',
    },

    9: {
        title: 'Burger bò phô mai',
        description:
            'Burger bò kèm phô mai, rau xanh và sốt.',
        category: 'Đồ ăn',
        image:
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    },

    10: {
        title: 'Trà đào',
        description:
            'Trà đào thơm mát, phù hợp giải khát sau giờ học.',
        category: 'Nước uống',
        image:
            'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600',
    },

    11: {
        title: 'Pizza phô mai',
        description:
            'Pizza nóng với lớp phô mai béo thơm.',
        category: 'Đồ ăn',
        image:
            'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
    },

    12: {
        title: 'Sữa tươi',
        description:
            'Sữa tươi tiện lợi dùng cho bữa sáng hoặc ăn nhẹ.',
        category: 'Nước uống',
        image:
            'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600',
    },
};

/**
 * Chuẩn hóa tiếng Việt để tìm kiếm:
 * "com" -> "com"
 * "Cơm" -> "com"
 * "nuoc" -> "nuoc"
 * "Nước" -> "nuoc"
 */
function normalizeText(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function mapProduct(product: FakeStoreProduct): Product {
    const ktxProduct = KTX_PRODUCTS[product.id];

    const ktxPrice = KTXGO_PRICES[product.id] ?? 15000;

    if (!ktxProduct) {
        return {
            id: product.id,
            title: product.title,
            description: product.description,
            price: ktxPrice / PRICE_MULTIPLIER,
            thumbnail: product.image,
            category: product.category,
        };
    }

    return {
        id: product.id,
        title: ktxProduct.title,
        description: ktxProduct.description,
        price: ktxPrice / PRICE_MULTIPLIER,
        thumbnail: ktxProduct.image,
        category: ktxProduct.category,
    };
}

export async function fetchProducts(
    searchQuery = '',
): Promise<Product[]> {
    const response = await apiClient.get<FakeStoreProduct[]>(
        '/products?limit=12',
    );

    const products = response.data.map(mapProduct);

    const keyword = normalizeText(searchQuery);

    if (!keyword) {
        return products;
    }

    return products.filter(product => {
        return (
            normalizeText(product.title).includes(keyword) ||
            normalizeText(product.category).includes(keyword) ||
            normalizeText(product.description).includes(keyword)
        );
    });
}

export async function fetchProductById(
    id: number,
): Promise<Product> {
    const response = await apiClient.get<FakeStoreProduct>(
        `/products/${id}`,
    );

    return mapProduct(response.data);
}