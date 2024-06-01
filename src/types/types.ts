export type User = {
    name: string,
    email: string,
    photo: string,
    gender: string,
    role: string,
    dob: string,
    _id: string
}

export type Product = {
    name: string,
    price: number,
    stock: number,
    category: string,
    photo: string,
    _id: string
}

export type ShippingInfo = {
    address: string,
    city: string,
    state: string,
    country: string
    pinCode: string,
}

export type CartItem = {
    productId: string,
    photo: string,
    name: string,
    price: number,
    quantity: number,
    stock: number
}

export type OrderItem = Omit<CartItem, "stock"> & {
    _id: string
};

export type Order = {
    orderItems: OrderItem[],
    shippingInfo: ShippingInfo,
    subTotal: number,
    tax: number,
    shippingCharges: number,
    discount: number,   
    total: number,
    status: string,
    user: {
        name: string,
        _id: string
    },
    _id: string,

}

type ChangeAndCount = {
    revenue: number;
    product: number;
    user: number;
    order: number;
}

type LatestTransaction = {
    _id: string;
    discount: number;
    amount: number;
    quantity: number;
    status: "Processing" | "Shipped" | "Deliverd";
}

export type Stats = {
    categoryCount:  Record<string, number>[],
    changePercent: ChangeAndCount,
    count: ChangeAndCount,
    chart: {
        order: number[],
        revenue: number[]
    },
    userRatio: {
        male: number;
        female: number;
    },
    latestTransactions: LatestTransaction[]
}

type RevenueDistribution = {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
}
type OrderFullfillment = {
    processing: number;
    shipped: number;
    delivered: number;
}
type AgeGroup = {
    teen: number;
    adult: number;
    old: number;
}
export type Pie = {
    orderFullfillment: OrderFullfillment,
    productCategories: Record<string, number>[],
    stockAvailability: {
        inStock: number;
        outOfStock: number;
    },
    revenueDistribution: RevenueDistribution,
    adminCustomer: {
        admin: number;
        customer: number;
    },
    usersAgeGroup: AgeGroup
}

export type Bar = {
    users: number[],
    products: number[],
    order: number[]
}

export type Line = {
    users: number[],
    products: number[],
    discount: number[],
    revenue: number[],
}
