import type { Buyer, Seller, SalesData, DashboardStats, Order, OrderItem } from '../types';

const productNames = ['Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'USB-C Hub', 'Mechanical Keyboard', 'Monitor Light', 'Webcam HD', 'Mouse Pad XL'];
const streets = ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm Blvd', '654 Maple Dr'];
const cities = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ'];

// Generate mock orders
export const generateMockOrders = (count: number): Order[] => {
  const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Anna', 'Tom', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
  
  return Array.from({ length: count }, (_, i) => {
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items: OrderItem[] = Array.from({ length: itemCount }, () => ({
      name: productNames[Math.floor(Math.random() * productNames.length)],
      quantity: Math.floor(Math.random() * 3) + 1,
      price: Math.floor(Math.random() * 200) + 20,
      sku: `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    }));
    
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    
    return {
      id: `order-${i + 1}`,
      orderNumber: `ORD-${String(10000 + i).padStart(6, '0')}`,
      customerName: `${firstName} ${lastName}`,
      customerEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      shippingAddress: `${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]} ${Math.floor(Math.random() * 90000) + 10000}`,
      items,
      total,
      status,
      trackingNumber: ['shipped', 'delivered'].includes(status) ? `TRK${Math.random().toString(36).substring(2, 12).toUpperCase()}` : undefined,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - (daysAgo - 1) * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

// Generate mock buyers
export const generateMockBuyers = (count: number = 50): Buyer[] => {
  const statuses: Buyer['status'][] = ['active', 'inactive', 'suspended'];
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Chris', 'Lisa', 'Robert', 'Amanda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Wilson', 'Taylor'];
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    return {
      id: `buyer-${i + 1}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      totalOrders: Math.floor(Math.random() * 50),
      totalSpent: Math.floor(Math.random() * 5000) + 100,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastOrderAt: Math.random() > 0.3 
        ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() 
        : undefined,
    };
  });
};

// Generate mock sellers
export const generateMockSellers = (count: number = 30): Seller[] => {
  const statuses: Seller['status'][] = ['active', 'inactive', 'pending', 'suspended'];
  const storeNames = ['Tech Hub', 'Fashion Forward', 'Home Essentials', 'Sports Zone', 'Beauty Corner', 'Book Haven', 'Gadget World', 'Kitchen Pro', 'Pet Paradise', 'Green Garden'];
  const firstNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Blake'];
  const lastNames = ['Anderson', 'Thompson', 'Martinez', 'Robinson', 'Clark', 'Lewis', 'Lee', 'Walker', 'Hall', 'Young'];
  
  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const storeName = `${storeNames[Math.floor(Math.random() * storeNames.length)]} ${i + 1}`;
    
    return {
      id: `seller-${i + 1}`,
      name,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@seller.com`,
      phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      storeName,
      totalProducts: Math.floor(Math.random() * 100) + 10,
      totalSales: Math.floor(Math.random() * 500) + 50,
      revenue: Math.floor(Math.random() * 50000) + 5000,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
    };
  });
};

// Generate mock sales data for charts
export const generateMockSalesData = (days: number = 30): SalesData[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    return {
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 100) + 50,
      orders: Math.floor(Math.random() * 50) + 20,
      revenue: Math.floor(Math.random() * 10000) + 2000,
    };
  });
};

// Generate dashboard stats
export const generateDashboardStats = (): DashboardStats => {
  return {
    totalSales: 12458,
    totalOrders: 3847,
    totalRevenue: 458920,
    totalBuyers: 2341,
    totalSellers: 156,
    salesGrowth: 12.5,
    ordersGrowth: 8.3,
    revenueGrowth: 15.2,
  };
};

// Mock API delay
export const mockApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Mock reptile data
// export const mockReptiles: import('../types').Reptile[] = [
//   {
//     id: 1,
//     title: "High Yellow Leopard Gecko",
//     category: "Geckos",
//     price: 89,
//     location: "California",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/leopard-gecko-yellow-morph-spotted-ii2rcAWmMv0RJ3UolI9XzEQ9LfrkuG.jpg",
//     breeder: "Gecko Paradise",
//     verified: true,
//     sex: "male",
//     weight: 45,
//     traits: ["High Yellow", "Spotted"],
//     description: "Beautiful high yellow leopard gecko with excellent pattern.",
//     age: "6 months",
//     createdAt: "2024-01-15T10:00:00Z"
//   },
//   {
//     id: 2,
//     title: "Banana Ball Python",
//     category: "Snakes",
//     price: 249,
//     location: "Texas",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/banana-ball-python-yellow-morph-DPWgDG9OwmzLBh4a6fg1YJuuY1yJ7D.jpg",
//     breeder: "Elite Serpents",
//     verified: true,
//     sex: "female",
//     weight: 850,
//     traits: ["Banana", "Het Clown"],
//     description: "Stunning banana ball python, perfect for collectors.",
//     age: "1 year",
//     createdAt: "2024-01-14T14:30:00Z"
//   },
//   {
//     id: 3,
//     title: "Ambilobe Panther Chameleon",
//     category: "Chameleons",
//     price: 425,
//     location: "Florida",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/panther-chameleon-blue-red-colorful-MWDG1xl9pAXrqIJbhLD0a5VNpiNkAk.jpg",
//     breeder: "Chameleon Kingdom",
//     verified: true,
//     sex: "male",
//     weight: 120,
//     traits: ["Ambilobe", "High Color"],
//     description: "Vibrant panther chameleon with excellent color expression.",
//     age: "8 months",
//     createdAt: "2024-01-13T09:15:00Z"
//   },
//   {
//     id: 4,
//     title: "Citrus Bearded Dragon",
//     category: "Bearded Dragons",
//     price: 175,
//     location: "Arizona",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/bearded-dragon-orange-citrus-morph-hQNWdWEgXQTZ3mYvafUdfvNkSrpuEt.jpg",
//     breeder: "Dragon Den",
//     verified: true,
//     sex: "female",
//     weight: 280,
//     traits: ["Citrus", "Translucent"],
//     description: "Healthy citrus bearded dragon, very active and eating well.",
//     age: "10 months",
//     createdAt: "2024-01-12T16:45:00Z"
//   },
//   {
//     id: 5,
//     title: "Crested Gecko - Harlequin",
//     category: "Geckos",
//     price: 129,
//     location: "Oregon",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/crested-gecko-orange-harlequin-pattern-Wke2RcEKT6yD9kKLF8i1x6Ur24RMTB.jpg",
//     breeder: "Crest Breeders Co",
//     verified: true,
//     sex: "unknown",
//     weight: 35,
//     traits: ["Harlequin", "Orange"],
//     description: "Beautiful harlequin crested gecko with striking pattern.",
//     age: "1 year",
//     createdAt: "2024-01-11T11:20:00Z"
//   },
//   {
//     id: 6,
//     title: "Blue Eye Leucistic Ball Python",
//     category: "Snakes",
//     price: 399,
//     location: "Georgia",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/blue-eyed-leucistic-ball-python-white-ji8lJRg78pI0c0sjuYXt9uOUN8L9eV.jpg",
//     breeder: "Python Palace",
//     verified: true,
//     sex: "male",
//     weight: 720,
//     traits: ["Leucistic", "Blue Eyes"],
//     description: "Rare blue eye leucistic ball python, show quality.",
//     age: "14 months",
//     createdAt: "2024-01-10T13:10:00Z"
//   },
//   {
//     id: 7,
//     title: "Veiled Chameleon",
//     category: "Chameleons",
//     price: 195,
//     location: "Nevada",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/veiled-chameleon-green-yellow-colorful-8p8wJ8g9pAXrqIJbhLD0a5VNpiNkAk.jpg",
//     breeder: "Desert Chameleons",
//     verified: false,
//     sex: "female",
//     weight: 95,
//     traits: ["Veiled", "Yellow"],
//     description: "Healthy veiled chameleon, great starter pet.",
//     age: "7 months",
//     createdAt: "2024-01-09T15:30:00Z"
//   },
//   {
//     id: 8,
//     title: "Red Bearded Dragon",
//     category: "Bearded Dragons",
//     price: 145,
//     location: "Colorado",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/bearded-dragon-red-morph-close-up-4p8wJ8g9pAXrqIJbhLD0a5VNpiNkAk.jpg",
//     breeder: "Mountain Dragons",
//     verified: true,
//     sex: "male",
//     weight: 320,
//     traits: ["Red", "Silky"],
//     description: "Striking red bearded dragon with excellent temperament.",
//     age: "9 months",
//     createdAt: "2024-01-08T12:00:00Z"
//   },
//   {
//     id: 9,
//     title: "Corn Snake - Sunglow",
//     category: "Snakes",
//     price: 85,
//     location: "North Carolina",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/corn-snake-orange-sunglow-morph-5p8wJ8g9pAXrqIJbhLD0a5VNpiNkAk.jpg",
//     breeder: "Southern Snakes",
//     verified: false,
//     sex: "female",
//     weight: 180,
//     traits: ["Sunglow", "Het Anerythristic"],
//     description: "Beautiful sunglow corn snake, easy to care for.",
//     age: "8 months",
//     createdAt: "2024-01-07T10:45:00Z"
//   },
//   {
//     id: 10,
//     title: "Leopard Gecko - Blizzard",
//     category: "Geckos",
//     price: 65,
//     location: "Washington",
//     image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/leopard-gecko-white-blizzard-morph-6p8wJ8g9pAXrqIJbhLD0a5VNpiNkAk.jpg",
//     breeder: "Pacific Geckos",
//     verified: true,
//     sex: "male",
//     weight: 38,
//     traits: ["Blizzard", "White"],
//     description: "Rare blizzard leopard gecko, very unique.",
//     age: "5 months",
//     createdAt: "2024-01-06T14:20:00Z"
//   }
// ];
