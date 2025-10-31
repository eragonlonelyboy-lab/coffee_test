import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMenuItems = async (languageCode: string = 'en') => {
    const items = await prisma.menuItem.findMany({
        where: { store: { name: { not: undefined } } } // A filter to ensure items belong to a store
    });

    if (languageCode === 'en' || languageCode.startsWith('en')) {
        return items;
    }

    const itemIds = items.map(item => item.id);
    const translations = await prisma.menuTranslation.findMany({
        where: {
            menuItemId: { in: itemIds },
            languageCode,
        }
    });

    const translatedItems = items.map(item => {
        const translation = translations.find(t => t.menuItemId === item.id);
        return translation ? {
            ...item,
            name: translation.name,
            description: translation.description,
        } : item;
    });

    return translatedItems;
};


export const getAllStores = async () => {
    return prisma.store.findMany();
};

export const getStoreById = async (storeId: string) => {
    return prisma.store.findUnique({
        where: { id: storeId }
    });
};
