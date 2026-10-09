import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Customer, Order, OrderStatus, Product } from '../types/store';
import { INITIAL_PRODUCTS } from './seedData';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const CUSTOMERS_COLLECTION = 'customers';

// =================== PRODUK & KATALOG ===================

export function subscribeProducts(
  onSuccess: (products: Product[]) => void,
  onError?: (err: Error) => void
) {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('category', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((docSnap) => {
        products.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
      });
      onSuccess(products);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, PRODUCTS_COLLECTION);
    }
  );
}

export async function seedInitialProductsIfNeeded(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (snap.empty) {
      console.log('Seeding initial 20 phone products into Firestore...');
      const batch = writeBatch(db);
      for (let i = 0; i < INITIAL_PRODUCTS.length; i++) {
        const item = INITIAL_PRODUCTS[i];
        const newDocRef = doc(collection(db, PRODUCTS_COLLECTION));
        batch.set(newDocRef, {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      await batch.commit();
      return true;
    } else {
      // 1. Upgrade existing products to real photo URLs and update specs
      const batch = writeBatch(db);
      let needsUpdate = false;
      const existingNames = new Set<string>();

      snap.docs.forEach((d) => {
        const data = d.data() as Product;
        existingNames.add(data.name.toLowerCase());
        const matchingSeed = INITIAL_PRODUCTS.find((p) => p.name.toLowerCase() === data.name.toLowerCase());
        if (matchingSeed) {
          // If image is an SVG data url or different, update to the realistic photographic image
          if (data.imageUrl.startsWith('data:image/svg') || data.imageUrl !== matchingSeed.imageUrl) {
            batch.update(d.ref, {
              imageUrl: matchingSeed.imageUrl,
              description: matchingSeed.description,
              specs: matchingSeed.specs,
              updatedAt: new Date().toISOString(),
            });
            needsUpdate = true;
          }
        }
      });

      // 2. Insert any newly added products (e.g. 13-20) if not in database yet
      for (const item of INITIAL_PRODUCTS) {
        if (!existingNames.has(item.name.toLowerCase())) {
          const newDocRef = doc(collection(db, PRODUCTS_COLLECTION));
          batch.set(newDocRef, {
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await batch.commit();
      }
      return false;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
  }
}

export async function resetCatalogToDefault(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();

    const insertBatch = writeBatch(db);
    for (const item of INITIAL_PRODUCTS) {
      const newDocRef = doc(collection(db, PRODUCTS_COLLECTION));
      insertBatch.set(newDocRef, {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    await insertBatch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  try {
    const newDocRef = doc(collection(db, PRODUCTS_COLLECTION));
    await setDoc(newDocRef, {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newDocRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, PRODUCTS_COLLECTION);
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${id}`;
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateProductStock(id: string, newStock: number): Promise<void> {
  return updateProduct(id, { stock: Math.max(0, newStock) });
}

// =================== PESANAN & CHECKOUT ===================

export function subscribeOrders(
  onSuccess: (orders: Order[]) => void,
  onError?: (err: Error) => void
) {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((docSnap) => {
        orders.push({ id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) });
      });
      onSuccess(orders);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, ORDERS_COLLECTION);
    }
  );
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const docSnap = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createOrder(
  orderInput: Omit<Order, 'id' | 'createdAt' | 'status'>
): Promise<Order> {
  const newOrderRef = doc(collection(db, ORDERS_COLLECTION));
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...orderInput,
    id: orderId,
    status: 'menunggu_pembayaran',
    createdAt: now,
    updatedAt: now,
  };

  try {
    // 1. Simpan order
    await setDoc(doc(db, ORDERS_COLLECTION, orderId), newOrder);

    // 2. Potong stok produk terkait di database
    for (const item of orderInput.items) {
      try {
        const prodRef = doc(db, PRODUCTS_COLLECTION, item.productId);
        const prodSnap = await getDoc(prodRef);
        if (prodSnap.exists()) {
          const currentStock = prodSnap.data().stock || 0;
          await updateDoc(prodRef, {
            stock: Math.max(0, currentStock - item.quantity),
            updatedAt: now,
          });
        }
      } catch (err) {
        console.warn('Could not auto-decrement stock for', item.productId, err);
      }
    }

    // 3. Simpan atau perbarui data pelanggan (CRM Customer)
    try {
      const customerId = orderInput.customerEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const custRef = doc(db, CUSTOMERS_COLLECTION, customerId);
      const custSnap = await getDoc(custRef);

      if (custSnap.exists()) {
        const existingData = custSnap.data() as Customer;
        await updateDoc(custRef, {
          name: orderInput.customerName,
          phone: orderInput.customerPhone,
          address: orderInput.customerAddress,
          totalOrders: (existingData.totalOrders || 0) + 1,
          totalSpent: (existingData.totalSpent || 0) + orderInput.totalAmount,
          lastOrderAt: now,
        });
      } else {
        await setDoc(custRef, {
          id: customerId,
          name: orderInput.customerName,
          email: orderInput.customerEmail,
          phone: orderInput.customerPhone,
          address: orderInput.customerAddress,
          totalOrders: 1,
          totalSpent: orderInput.totalAmount,
          lastOrderAt: now,
          createdAt: now,
        });
      }
    } catch (err) {
      console.warn('Customer summary update error:', err);
    }

    return newOrder;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ORDERS_COLLECTION);
  }
}

export async function uploadPaymentProof(
  orderId: string,
  proofDataUrl: string
): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
      paymentProofUrl: proofDataUrl,
      paymentProofUploadedAt: now,
      status: 'menunggu_approval',
      updatedAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function approvePayment(
  orderId: string,
  trackingNumber?: string
): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
      status: 'diproses',
      trackingNumber: trackingNumber || '',
      rejectionReason: '',
      updatedAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function rejectPayment(
  orderId: string,
  reason: string
): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), {
      status: 'ditolak',
      rejectionReason: reason,
      updatedAt: now,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  trackingNumber?: string
): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${orderId}`;
  try {
    const now = new Date().toISOString();
    const updatePayload: Record<string, any> = {
      status: newStatus,
      updatedAt: now,
    };
    if (trackingNumber !== undefined) {
      updatePayload.trackingNumber = trackingNumber;
    }
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// =================== DATA PELANGGAN ===================

export function subscribeCustomers(
  onSuccess: (customers: Customer[]) => void,
  onError?: (err: Error) => void
) {
  const q = query(collection(db, CUSTOMERS_COLLECTION), orderBy('lastOrderAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const customers: Customer[] = [];
      snapshot.forEach((docSnap) => {
        customers.push({ id: docSnap.id, ...(docSnap.data() as Omit<Customer, 'id'>) });
      });
      onSuccess(customers);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, CUSTOMERS_COLLECTION);
    }
  );
}
