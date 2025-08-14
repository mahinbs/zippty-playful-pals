import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, LogOut, Settings, Package, Users, BarChart3, Upload, Save, X, Image, Link, FileImage } from "lucide-react";
import { Product } from "@/contexts/CartContext";
import { formatPrice } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock admin credentials (in production, this would be in a secure backend)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "zippty2024"
};
interface AdminProduct extends Product {
  stock?: number;
  isActive?: boolean;
}
const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "file">("url");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Form state for adding/editing products
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    description: "",
    stock: "0",
    isActive: true,
    isNew: false,
    rating: "5",
    reviews: "0",
    features: [""],
    image: ""
  });

  // Check if user is already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem("admin-authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadProducts();
    }
  }, []);
  const loadProducts = () => {
    // Load products from localStorage (in production, this would be from API)
    const savedProducts = localStorage.getItem("admin-products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // If no admin products exist, create some sample products
      const sampleProducts: AdminProduct[] = [{
        id: '1',
        name: 'SmartPlay Robot Companion',
        price: 149.99,
        originalPrice: 199.99,
        image: '/src/assets/robot-toy-premium.jpg',
        category: 'Interactive Robots',
        description: 'An advanced AI-powered robot companion that adapts to your pet\'s behavior and provides hours of interactive entertainment.',
        features: ['AI-powered adaptive play modes', 'Motion sensors and obstacle avoidance', 'LED light patterns for visual stimulation', 'Rechargeable battery (8+ hours)', 'Safe, durable materials', 'App connectivity for remote control'],
        rating: 5,
        reviews: 127,
        isNew: true,
        stock: 25,
        isActive: true
      }, {
        id: '2',
        name: 'FelineBot Interactive Cat Toy',
        price: 89.99,
        image: '/src/assets/cat-toy-premium.jpg',
        category: 'Cat Toys',
        description: 'A high-tech interactive toy designed specifically for cats, featuring feathers, motion sensors, and unpredictable movement patterns.',
        features: ['Automatic motion detection', 'Replaceable feather attachments', 'Silent motor operation', 'Timer-based play sessions', 'Battery level indicator', 'Washable components'],
        rating: 5,
        reviews: 89,
        stock: 15,
        isActive: true
      }, {
        id: '3',
        name: 'BrainBoost Puzzle Feeder',
        price: 69.99,
        originalPrice: 89.99,
        image: '/src/assets/puzzle-feeder-premium.jpg',
        category: 'Smart Feeders',
        description: 'Transform mealtime into a mental workout with this innovative puzzle feeder.',
        features: ['Adjustable difficulty levels', 'Multiple feeding compartments', 'Non-slip base design', 'Easy to clean and fill', 'Slows down eating pace', 'Suitable for all pet sizes'],
        rating: 4,
        reviews: 203,
        stock: 30,
        isActive: true
      }];
      setProducts(sampleProducts);
      localStorage.setItem("admin-products", JSON.stringify(sampleProducts));
    }
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem("admin-authenticated", "true");
      loadProducts();
    } else {
      setLoginError("Invalid username or password");
    }
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin-authenticated");
    navigate("/");
  };
  const handleAddProduct = () => {
    const newProduct: AdminProduct = {
      id: Date.now().toString(),
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      image: formData.image || "/src/assets/robot-toy-premium.jpg",
      // Default image
      category: formData.category,
      description: formData.description,
      features: formData.features.filter(f => f.trim() !== ""),
      rating: parseInt(formData.rating),
      reviews: parseInt(formData.reviews),
      isNew: formData.isNew,
      stock: parseInt(formData.stock),
      isActive: formData.isActive
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem("admin-products", JSON.stringify(updatedProducts));

    // Reset form
    setFormData({
      name: "",
      price: "",
      originalPrice: "",
      category: "",
      description: "",
      stock: "0",
      isActive: true,
      isNew: false,
      rating: "5",
      reviews: "0",
      features: [""],
      image: ""
    });
    setImagePreview("");
    setImageUploadMethod("url");
    setIsAddDialogOpen(false);
  };
  const handleEditProduct = () => {
    if (!editingProduct) return;
    const updatedProduct: AdminProduct = {
      ...editingProduct,
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      category: formData.category,
      description: formData.description,
      features: formData.features.filter(f => f.trim() !== ""),
      rating: parseInt(formData.rating),
      reviews: parseInt(formData.reviews),
      isNew: formData.isNew,
      stock: parseInt(formData.stock),
      isActive: formData.isActive
    };
    const updatedProducts = products.map(p => p.id === editingProduct.id ? updatedProduct : p);
    setProducts(updatedProducts);
    localStorage.setItem("admin-products", JSON.stringify(updatedProducts));
    setEditingProduct(null);
    setImagePreview("");
    setImageUploadMethod("url");
    setIsEditDialogOpen(false);
  };
  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    const updatedProducts = products.filter(p => p.id !== productToDelete.id);
    setProducts(updatedProducts);
    localStorage.setItem("admin-products", JSON.stringify(updatedProducts));
    setProductToDelete(null);
    setIsDeleteDialogOpen(false);
  };
  const openEditDialog = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category,
      description: product.description || "",
      stock: product.stock?.toString() || "0",
      isActive: product.isActive ?? true,
      isNew: product.isNew || false,
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      features: product.features?.length ? product.features : [""],
      image: product.image || ""
    });
    setImagePreview(product.image || "");
    setIsEditDialogOpen(true);
  };
  const openDeleteDialog = (product: AdminProduct) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };
  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };
  const removeFeatureField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  // Image handling functions
  const handleImageUrlChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      image: url
    }));
    setImagePreview(url);
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImageUploading(true);

      // Create a preview URL for the file
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          image: result
        }));
        setIsImageUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };
  const clearImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ""
    }));
    setImagePreview("");
  };

  // Login Form
  if (!isAuthenticated) {
    return <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>;
  }

  // Admin Dashboard
  return <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and store</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Welcome, Admin</Badge>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Products</p>
                  <p className="text-2xl font-bold">{products.filter(p => p.isActive).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{new Set(products.map(p => p.category)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Settings className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Products</p>
                  <p className="text-2xl font-bold">{products.filter(p => p.isNew).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Helpful Info Card */}
        <Card className="mb-6 border-blue-200 bg-blue-50/10">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How to Edit Products</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>View Products:</strong> All your products are listed in the table below</li>
                  <li>• <strong>Edit Product:</strong> Click the ✏️ (edit) button next to any product</li>
                  <li>• <strong>Update Details:</strong> Modify name, price, description, stock, features, etc.</li>
                  <li>• <strong>Save Changes:</strong> Click "Save Changes" to update the product</li>
                  <li>• <strong>Active/Inactive:</strong> Toggle product visibility on your website</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new product
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({
                        ...prev,
                        name: e.target.value
                      }))} placeholder="Enter product name" />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={value => setFormData(prev => ({
                        ...prev,
                        category: value
                      }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Interactive Robots">Interactive Robots</SelectItem>
                            <SelectItem value="Cat Toys">Cat Toys</SelectItem>
                            <SelectItem value="Smart Feeders">Smart Feeders</SelectItem>
                            <SelectItem value="Dog Toys">Dog Toys</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData(prev => ({
                        ...prev,
                        price: e.target.value
                      }))} placeholder="0.00" />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Original Price (₹)</Label>
                        <Input id="originalPrice" type="number" step="0.01" value={formData.originalPrice} onChange={e => setFormData(prev => ({
                        ...prev,
                        originalPrice: e.target.value
                      }))} placeholder="0.00" />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" type="number" value={formData.stock} onChange={e => setFormData(prev => ({
                        ...prev,
                        stock: e.target.value
                      }))} placeholder="0" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" value={formData.description} onChange={e => setFormData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))} placeholder="Enter product description" rows={3} />
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      <Label>Product Image</Label>
                      
                      {/* Image Upload Method Toggle */}
                      <div className="flex space-x-2">
                        <Button type="button" variant={imageUploadMethod === "url" ? "default" : "outline"} size="sm" onClick={() => setImageUploadMethod("url")}>
                          <Link className="h-4 w-4 mr-2" />
                          Image URL
                        </Button>
                        <Button type="button" variant={imageUploadMethod === "file" ? "default" : "outline"} size="sm" onClick={() => setImageUploadMethod("file")}>
                          <FileImage className="h-4 w-4 mr-2" />
                          Upload File
                        </Button>
                      </div>

                      {/* Image URL Input */}
                      {imageUploadMethod === "url" && <div className="space-y-2">
                          <Input placeholder="Enter image URL (e.g., https://example.com/image.jpg)" value={formData.image} onChange={e => handleImageUrlChange(e.target.value)} />
                          <p className="text-sm text-muted-foreground">
                            Enter a direct link to an image (JPG, PNG, WebP supported)
                          </p>
                        </div>}

                      {/* File Upload */}
                      {imageUploadMethod === "file" && <div className="space-y-2">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="image-upload" />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                {isImageUploading ? "Uploading..." : "Click to upload image"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                JPG, PNG, WebP up to 5MB
                              </p>
                            </label>
                          </div>
                        </div>}

                      {/* Image Preview */}
                      {(imagePreview || formData.image) && <div className="space-y-2">
                          <Label>Image Preview</Label>
                          <div className="relative inline-block">
                            <img src={imagePreview || formData.image} alt="Product preview" className="w-32 h-32 object-cover rounded-lg border" onError={e => {
                          e.currentTarget.src = "/src/assets/robot-toy-premium.jpg";
                        }} />
                            <Button type="button" variant="outline" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={clearImage}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <Input id="rating" type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData(prev => ({
                        ...prev,
                        rating: e.target.value
                      }))} />
                      </div>
                      <div>
                        <Label htmlFor="reviews">Reviews Count</Label>
                        <Input id="reviews" type="number" value={formData.reviews} onChange={e => setFormData(prev => ({
                        ...prev,
                        reviews: e.target.value
                      }))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Features</Label>
                      {formData.features.map((feature, index) => <div key={index} className="flex space-x-2">
                          <Input value={feature} onChange={e => updateFeature(index, e.target.value)} placeholder={`Feature ${index + 1}`} />
                          <Button type="button" variant="outline" size="icon" onClick={() => removeFeatureField(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>)}
                      <Button type="button" variant="outline" onClick={addFeatureField}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Feature
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="isActive" checked={formData.isActive} onCheckedChange={checked => setFormData(prev => ({
                      ...prev,
                      isActive: checked
                    }))} />
                      <Label htmlFor="isActive">Active Product</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="isNew" checked={formData.isNew} onCheckedChange={checked => setFormData(prev => ({
                      ...prev,
                      isNew: checked
                    }))} />
                      <Label htmlFor="isNew">New Product</Label>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddProduct}>
                      <Save className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
                <CardDescription>
                  Manage your product catalog. Click the edit button (✏️) to modify any product, or the delete button (🗑️) to remove products.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {products.length === 0 ? <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first product using the "Add Product" button above.
                    </p>
                  </div> : <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4">Product</th>
                          <th className="text-left p-4">Category</th>
                          <th className="text-left p-4">Price</th>
                          <th className="text-left p-4">Stock</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => <tr key={product.id} className="border-b hover:bg-muted/50">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {product.isNew && <Badge variant="secondary" className="mr-1">New</Badge>}
                                    Rating: {product.rating}/5 ({product.reviews} reviews)
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">{product.category}</td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{formatPrice(product.price)}</p>
                                {product.originalPrice && <p className="text-sm text-muted-foreground line-through">
                                    {formatPrice(product.originalPrice)}
                                  </p>}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{product.stock || 0}</span>
                                {product.stock && product.stock < 10 && <Badge variant="destructive" className="text-xs">Low Stock</Badge>}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={product.isActive ? "default" : "secondary"}>
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="icon" onClick={() => openEditDialog(product)} title="Edit Product" className="text-zinc-50">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => openDeleteDialog(product)} title="Delete Product">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  View your store performance and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analytics features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription>
                  Manage your admin account and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Settings features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Product Name</Label>
                <Input id="edit-name" value={formData.name} onChange={e => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))} placeholder="Enter product name" />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={value => setFormData(prev => ({
                ...prev,
                category: value
              }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Interactive Robots">Interactive Robots</SelectItem>
                    <SelectItem value="Cat Toys">Cat Toys</SelectItem>
                    <SelectItem value="Smart Feeders">Smart Feeders</SelectItem>
                    <SelectItem value="Dog Toys">Dog Toys</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input id="edit-price" type="number" step="0.01" value={formData.price} onChange={e => setFormData(prev => ({
                ...prev,
                price: e.target.value
              }))} placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="edit-originalPrice">Original Price (₹)</Label>
                <Input id="edit-originalPrice" type="number" step="0.01" value={formData.originalPrice} onChange={e => setFormData(prev => ({
                ...prev,
                originalPrice: e.target.value
              }))} placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock</Label>
                <Input id="edit-stock" type="number" value={formData.stock} onChange={e => setFormData(prev => ({
                ...prev,
                stock: e.target.value
              }))} placeholder="0" />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" value={formData.description} onChange={e => setFormData(prev => ({
              ...prev,
              description: e.target.value
            }))} placeholder="Enter product description" rows={3} />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Product Image</Label>
              
              {/* Image Upload Method Toggle */}
              <div className="flex space-x-2">
                <Button type="button" variant={imageUploadMethod === "url" ? "default" : "outline"} size="sm" onClick={() => setImageUploadMethod("url")}>
                  <Link className="h-4 w-4 mr-2" />
                  Image URL
                </Button>
                <Button type="button" variant={imageUploadMethod === "file" ? "default" : "outline"} size="sm" onClick={() => setImageUploadMethod("file")}>
                  <FileImage className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>

              {/* Image URL Input */}
              {imageUploadMethod === "url" && <div className="space-y-2">
                  <Input placeholder="Enter image URL (e.g., https://example.com/image.jpg)" value={formData.image} onChange={e => handleImageUrlChange(e.target.value)} />
                  <p className="text-sm text-muted-foreground">
                    Enter a direct link to an image (JPG, PNG, WebP supported)
                  </p>
                </div>}

              {/* File Upload */}
              {imageUploadMethod === "file" && <div className="space-y-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="edit-image-upload" />
                    <label htmlFor="edit-image-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {isImageUploading ? "Uploading..." : "Click to upload image"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG, WebP up to 5MB
                      </p>
                    </label>
                  </div>
                </div>}

              {/* Image Preview */}
              {(imagePreview || formData.image) && <div className="space-y-2">
                  <Label>Image Preview</Label>
                  <div className="relative inline-block">
                    <img src={imagePreview || formData.image} alt="Product preview" className="w-32 h-32 object-cover rounded-lg border" onError={e => {
                  e.currentTarget.src = "/src/assets/robot-toy-premium.jpg";
                }} />
                    <Button type="button" variant="outline" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={clearImage}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-rating">Rating</Label>
                <Input id="edit-rating" type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData(prev => ({
                ...prev,
                rating: e.target.value
              }))} />
              </div>
              <div>
                <Label htmlFor="edit-reviews">Reviews Count</Label>
                <Input id="edit-reviews" type="number" value={formData.reviews} onChange={e => setFormData(prev => ({
                ...prev,
                reviews: e.target.value
              }))} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              {formData.features.map((feature, index) => <div key={index} className="flex space-x-2">
                  <Input value={feature} onChange={e => updateFeature(index, e.target.value)} placeholder={`Feature ${index + 1}`} />
                  <Button type="button" variant="outline" size="icon" onClick={() => removeFeatureField(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>)}
              <Button type="button" variant="outline" onClick={addFeatureField}>
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="edit-isActive" checked={formData.isActive} onCheckedChange={checked => setFormData(prev => ({
              ...prev,
              isActive: checked
            }))} />
              <Label htmlFor="edit-isActive">Active Product</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="edit-isNew" checked={formData.isNew} onCheckedChange={checked => setFormData(prev => ({
              ...prev,
              isNew: checked
            }))} />
              <Label htmlFor="edit-isNew">New Product</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>;
};
export default Admin;