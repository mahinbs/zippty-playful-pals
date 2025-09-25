import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Image,
  Link,
  FileImage,
  Loader2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Upload,
} from "lucide-react";
import { bannersService, Banner, CreateBannerData } from "@/services/banners";
import { toast } from "sonner";

const AdminBannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Image handling states
  const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "file">("url");
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Form data
  const [formData, setFormData] = useState<CreateBannerData>({
    title: "",
    subtitle: "",
    description: "",
    button_text: "Shop Now",
    button_link: "/shop",
    background_image: "",
    mobile_image: "",
    desktop_image: "",
    overlay_opacity: 30,
    text_color: "white",
    is_active: true,
    display_order: 0,
  });

  // Load banners
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setIsLoading(true);
      const data = await bannersService.getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error("Error loading banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      button_text: "Shop Now",
      button_link: "/shop",
      background_image: "",
      mobile_image: "",
      desktop_image: "",
      overlay_opacity: 30,
      text_color: "white",
      is_active: true,
      display_order: 0,
    });
    setEditingBanner(null);
  };

  const handleAddBanner = async () => {
    try {
      setIsSubmitting(true);
      const newBanner = await bannersService.createBanner(formData);
      setBanners((prev) => [...prev, newBanner]);
      resetForm();
      setIsAddDialogOpen(false);
      toast.success("Banner added successfully");
    } catch (error) {
      console.error("Error adding banner:", error);
      toast.error("Failed to add banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBanner = async () => {
    if (!editingBanner) return;

    try {
      setIsSubmitting(true);
      const updatedBanner = await bannersService.updateBanner({
        id: editingBanner.id,
        ...formData,
      });
      setBanners((prev) =>
        prev.map((b) => (b.id === editingBanner.id ? updatedBanner : b))
      );
      resetForm();
      setIsEditDialogOpen(false);
      toast.success("Banner updated successfully");
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Failed to update banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;

    try {
      setIsSubmitting(true);
      await bannersService.deleteBanner(bannerToDelete.id);
      setBanners((prev) => prev.filter((b) => b.id !== bannerToDelete.id));
      setBannerToDelete(null);
      setIsDeleteDialogOpen(false);
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      const updatedBanner = await bannersService.toggleBannerStatus(
        banner.id,
        !banner.is_active
      );
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? updatedBanner : b))
      );
      toast.success(
        `Banner ${updatedBanner.is_active ? "activated" : "deactivated"}`
      );
    } catch (error) {
      console.error("Error toggling banner status:", error);
      toast.error("Failed to update banner status");
    }
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      button_text: banner.button_text || "Shop Now",
      button_link: banner.button_link || "/shop",
      background_image: banner.background_image || "",
      mobile_image: banner.mobile_image || "",
      desktop_image: banner.desktop_image || "",
      overlay_opacity: banner.overlay_opacity || 30,
      text_color: banner.text_color || "white",
      is_active: banner.is_active,
      display_order: banner.display_order,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (banner: Banner) => {
    setBannerToDelete(banner);
    setIsDeleteDialogOpen(true);
  };

  const moveBanner = async (banner: Banner, direction: "up" | "down") => {
    const currentIndex = banners.findIndex((b) => b.id === banner.id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === banners.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newBanners = [...banners];
    [newBanners[currentIndex], newBanners[newIndex]] = [
      newBanners[newIndex],
      newBanners[currentIndex],
    ];

    // Update display orders
    const updatedBanners = newBanners.map((b, index) => ({
      id: b.id,
      display_order: index,
    }));

    try {
      await bannersService.updateBannerOrder(updatedBanners);
      setBanners(newBanners);
      toast.success("Banner order updated");
    } catch (error) {
      console.error("Error updating banner order:", error);
      toast.error("Failed to update banner order");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: 'mobile' | 'desktop'
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsImageUploading(true);

    try {
      const uploadFormData = new FormData();
      Array.from(files).forEach((file) => {
        uploadFormData.append("files", file);
      });

      const response = await fetch(
        "https://tdzyskyjqobglueymvmx.supabase.co/functions/v1/upload-images",
        {
          method: "POST",
          body: uploadFormData,
          headers: {
            Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkenlza3lqcW9iZ2x1ZXltdm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NjM4MzYsImV4cCI6MjA3MDEzOTgzNn0.5fQXZ2dJF30gPq_VtKmg4L-_fV5pOp5Pd56PU5mHcUM"}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.uploaded.length > 0) {
        const imageUrl = result.uploaded[0].url;
        if (imageType === 'mobile') {
          setFormData((prev) => ({ ...prev, mobile_image: imageUrl }));
        } else {
          setFormData((prev) => ({ ...prev, desktop_image: imageUrl }));
        }
        toast.success(`${imageType} image uploaded successfully`);
      } else {
        throw new Error("No images were uploaded successfully");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsImageUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Banner Management</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage hero banners displayed on the homepage
          </p>
        </div>
        <Dialog
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>
                Create a new banner for the homepage hero section
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter banner title"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subtitle: e.target.value,
                      }))
                    }
                    placeholder="Enter banner subtitle"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter banner description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        button_text: e.target.value,
                      }))
                    }
                    placeholder="Shop Now"
                  />
                </div>
                <div>
                  <Label htmlFor="button_link">Button Link</Label>
                  <Input
                    id="button_link"
                    value={formData.button_link}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        button_link: e.target.value,
                      }))
                    }
                    placeholder="/shop"
                  />
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-6">
                <Label className="text-lg font-semibold">Banner Images</Label>

                {/* Image Upload Method Toggle */}
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={imageUploadMethod === "url" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImageUploadMethod("url")}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Image URL
                  </Button>
                  <Button
                    type="button"
                    variant={imageUploadMethod === "file" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImageUploadMethod("file")}
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </div>

                {/* Mobile Image Section */}
                <div className="space-y-3 border rounded-lg p-4">
                  <Label className="font-medium flex items-center gap-2">
                    📱 Mobile Image
                    <span className="text-sm text-muted-foreground font-normal">
                      (Optimized for phones)
                    </span>
                  </Label>

                  {imageUploadMethod === "url" && (
                    <Input
                      placeholder="Enter mobile image URL"
                      value={formData.mobile_image}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          mobile_image: e.target.value,
                        }))
                      }
                    />
                  )}

                  {imageUploadMethod === "file" && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'mobile')}
                        className="hidden"
                        id="mobile-image-upload"
                      />
                      <label htmlFor="mobile-image-upload" className="cursor-pointer">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {isImageUploading ? "Uploading..." : "Upload mobile image"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Portrait orientation recommended
                        </p>
                      </label>
                    </div>
                  )}

                  {formData.mobile_image && (
                    <div className="space-y-2">
                      <Label className="text-sm">Mobile Preview</Label>
                      <img
                        src={formData.mobile_image}
                        alt="Mobile banner preview"
                        className="w-full max-w-48 h-32 object-cover rounded-lg border mx-auto"
                        onError={(e) => {
                          e.currentTarget.src = "/src/assets/hero-pet-1.jpg";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Desktop Image Section */}
                <div className="space-y-3 border rounded-lg p-4">
                  <Label className="font-medium flex items-center gap-2">
                    💻 Desktop Image
                    <span className="text-sm text-muted-foreground font-normal">
                      (For tablets & desktop)
                    </span>
                  </Label>

                  {imageUploadMethod === "url" && (
                    <Input
                      placeholder="Enter desktop image URL"
                      value={formData.desktop_image}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          desktop_image: e.target.value,
                        }))
                      }
                    />
                  )}

                  {imageUploadMethod === "file" && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'desktop')}
                        className="hidden"
                        id="desktop-image-upload"
                      />
                      <label htmlFor="desktop-image-upload" className="cursor-pointer">
                        <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {isImageUploading ? "Uploading..." : "Upload desktop image"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Landscape orientation recommended
                        </p>
                      </label>
                    </div>
                  )}

                  {formData.desktop_image && (
                    <div className="space-y-2">
                      <Label className="text-sm">Desktop Preview</Label>
                      <img
                        src={formData.desktop_image}
                        alt="Desktop banner preview"
                        className="w-full h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = "/src/assets/hero-pet-1.jpg";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="overlay_opacity">Overlay Opacity (%)</Label>
                  <Input
                    id="overlay_opacity"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.overlay_opacity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        overlay_opacity: parseInt(e.target.value) || 30,
                      }))
                    }
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="text_color">Text Color</Label>
                  <Input
                    id="text_color"
                    value={formData.text_color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        text_color: e.target.value,
                      }))
                    }
                    placeholder="white"
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        display_order: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <Label htmlFor="is_active">Active Banner</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddBanner} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Banner
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners List */}
      <Card>
        <CardHeader>
          <CardTitle>Banner List</CardTitle>
          <CardDescription>
            Manage your homepage banners. Drag to reorder or click edit to
            modify.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Banners Found</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first banner using the "Add Banner" button
                above.
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {banners.map((banner, index) => (
                <Card key={banner.id} className="p-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={banner.background_image}
                      alt={banner.title}
                      className="w-24 h-16 object-cover rounded flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "/src/assets/hero-pet-1.jpg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {banner.title}
                          </h3>
                          {banner.subtitle && (
                            <p className="text-xs text-muted-foreground truncate">
                              {banner.subtitle}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant={banner.is_active ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {banner.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Order: {banner.display_order}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => moveBanner(banner, "up")}
                            disabled={index === 0}
                            title="Move Up"
                            className="h-8 w-8"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => moveBanner(banner, "down")}
                            disabled={index === banners.length - 1}
                            title="Move Down"
                            className="h-8 w-8"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleToggleStatus(banner)}
                            title={
                              banner.is_active ? "Deactivate" : "Activate"
                            }
                            className="h-8 w-8"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(banner)}
                            title="Edit Banner"
                            className="h-8 w-8"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteDialog(banner)}
                            title="Delete Banner"
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Banner Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Update the banner details</DialogDescription>
          </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Banner Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter banner title"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-subtitle">Subtitle (Optional)</Label>
                  <Input
                    id="edit-subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subtitle: e.target.value,
                      }))
                    }
                    placeholder="Enter banner subtitle"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter banner description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-button_text">Button Text</Label>
                  <Input
                    id="edit-button_text"
                    value={formData.button_text}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        button_text: e.target.value,
                      }))
                    }
                    placeholder="Shop Now"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-button_link">Button Link</Label>
                  <Input
                    id="edit-button_link"
                    value={formData.button_link}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        button_link: e.target.value,
                      }))
                    }
                    placeholder="/shop"
                  />
                </div>
              </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <Label className="text-lg font-semibold">Banner Images</Label>

              {/* Image Upload Method Toggle */}
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={imageUploadMethod === "url" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageUploadMethod("url")}
                >
                  <Link className="h-4 w-4 mr-2" />
                  Image URL
                </Button>
                <Button
                  type="button"
                  variant={imageUploadMethod === "file" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImageUploadMethod("file")}
                >
                  <FileImage className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>

              {/* Mobile Image Section */}
              <div className="space-y-3 border rounded-lg p-4">
                <Label className="font-medium flex items-center gap-2">
                  📱 Mobile Image
                  <span className="text-sm text-muted-foreground font-normal">
                    (Optimized for phones)
                  </span>
                </Label>

                {imageUploadMethod === "url" && (
                  <Input
                    placeholder="Enter mobile image URL"
                    value={formData.mobile_image}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        mobile_image: e.target.value,
                      }))
                    }
                  />
                )}

                {imageUploadMethod === "file" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'mobile')}
                      className="hidden"
                      id="edit-mobile-image-upload"
                    />
                    <label htmlFor="edit-mobile-image-upload" className="cursor-pointer">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {isImageUploading ? "Uploading..." : "Upload mobile image"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Portrait orientation recommended
                      </p>
                    </label>
                  </div>
                )}

                {formData.mobile_image && (
                  <div className="space-y-2">
                    <Label className="text-sm">Mobile Preview</Label>
                    <img
                      src={formData.mobile_image}
                      alt="Mobile banner preview"
                      className="w-full max-w-48 h-32 object-cover rounded-lg border mx-auto"
                      onError={(e) => {
                        e.currentTarget.src = "/src/assets/hero-pet-1.jpg";
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Desktop Image Section */}
              <div className="space-y-3 border rounded-lg p-4">
                <Label className="font-medium flex items-center gap-2">
                  💻 Desktop Image
                  <span className="text-sm text-muted-foreground font-normal">
                    (For tablets & desktop)
                  </span>
                </Label>

                {imageUploadMethod === "url" && (
                  <Input
                    placeholder="Enter desktop image URL"
                    value={formData.desktop_image}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        desktop_image: e.target.value,
                      }))
                    }
                  />
                )}

                {imageUploadMethod === "file" && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'desktop')}
                      className="hidden"
                      id="edit-desktop-image-upload"
                    />
                    <label htmlFor="edit-desktop-image-upload" className="cursor-pointer">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {isImageUploading ? "Uploading..." : "Upload desktop image"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Landscape orientation recommended
                      </p>
                    </label>
                  </div>
                )}

                {formData.desktop_image && (
                  <div className="space-y-2">
                    <Label className="text-sm">Desktop Preview</Label>
                    <img
                      src={formData.desktop_image}
                      alt="Desktop banner preview"
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = "/src/assets/hero-pet-1.jpg";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-overlay_opacity">Overlay Opacity (%)</Label>
                <Input
                  id="edit-overlay_opacity"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.overlay_opacity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      overlay_opacity: parseInt(e.target.value) || 30,
                    }))
                  }
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="edit-text_color">Text Color</Label>
                <Input
                  id="edit-text_color"
                  value={formData.text_color}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      text_color: e.target.value,
                    }))
                  }
                  placeholder="white"
                />
              </div>
              <div>
                <Label htmlFor="edit-display_order">Display Order</Label>
                <Input
                  id="edit-display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      display_order: parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
              <Label htmlFor="edit-is_active">Active Banner</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditBanner} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{bannerToDelete?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBanner}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBannerManagement;
