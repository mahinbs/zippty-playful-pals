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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  Image,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { bannersService, Banner, BannerInsert } from "@/services/banners";
import { toast } from "sonner";

const AdminBannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dialog states
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Initial form data
  const initialFormData = {
    title: "",
    subtitle: "",
    description: "",
    button_text: "Shop Now",
    button_link: "/shop",
    background_image: "",
    text_color: "white",
    overlay_opacity: 30,
    display_order: 0,
    is_active: true,
  };

  // Form state
  const [formData, setFormData] = useState(initialFormData);

  // Reset form function
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingBanner(null);
  };

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

  const handleAddBanner = async () => {
    try {
      setIsSubmitting(true);

      const bannerData: BannerInsert = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        button_text: formData.button_text,
        button_link: formData.button_link,
        background_image: formData.background_image || null,
        text_color: formData.text_color,
        overlay_opacity: formData.overlay_opacity,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      const newBanner = await bannersService.addBanner(bannerData);
      setBanners((prev) => [newBanner, ...prev]);

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

      const updateData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        button_text: formData.button_text,
        button_link: formData.button_link,
        background_image: formData.background_image || null,
        text_color: formData.text_color,
        overlay_opacity: formData.overlay_opacity,
        display_order: formData.display_order,
        is_active: formData.is_active,
      };

      const updatedBanner = await bannersService.updateBanner(
        editingBanner.id,
        updateData
      );
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
      text_color: banner.text_color || "white",
      overlay_opacity: banner.overlay_opacity || 30,
      display_order: banner.display_order || 0,
      is_active: banner.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (banner: Banner) => {
    setBannerToDelete(banner);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Banner Management
          </h2>
          <p className="text-muted-foreground">
            Manage homepage banners and carousel content
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>
                Create a new banner for the homepage carousel
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
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
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                    }
                    placeholder="Enter subtitle (optional)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Enter banner description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="background_image">Background Image URL</Label>
                <Input
                  id="background_image"
                  value={formData.background_image}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, background_image: e.target.value }))
                  }
                  placeholder="Enter image URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    value={formData.button_text}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, button_text: e.target.value }))
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
                      setFormData((prev) => ({ ...prev, button_link: e.target.value }))
                    }
                    placeholder="/shop"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="text_color">Text Color</Label>
                  <Select
                    value={formData.text_color}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, text_color: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="primary">Primary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="overlay_opacity">Overlay Opacity (%)</Label>
                  <Input
                    id="overlay_opacity"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.overlay_opacity}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, overlay_opacity: parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))
                    }
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
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddBanner}
                disabled={isSubmitting || !formData.title}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Banner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Image className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No banners found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create your first banner to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{banner.title}</h3>
                      <Badge variant={banner.is_active ? "default" : "secondary"}>
                        {banner.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">
                        Order: {banner.display_order}
                      </Badge>
                    </div>
                    
                    {banner.subtitle && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {banner.subtitle}
                      </p>
                    )}
                    
                    {banner.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {banner.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Button: {banner.button_text}</span>
                      <span>Link: {banner.button_link}</span>
                      <span>Text: {banner.text_color}</span>
                      <span>Overlay: {banner.overlay_opacity}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(banner)}
                    >
                      {banner.is_active ? <Eye className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(banner)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Update banner information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title *</Label>
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
                <Label htmlFor="edit-subtitle">Subtitle</Label>
                <Input
                  id="edit-subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  placeholder="Enter subtitle (optional)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Enter banner description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-background_image">Background Image URL</Label>
              <Input
                id="edit-background_image"
                value={formData.background_image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, background_image: e.target.value }))
                }
                placeholder="Enter image URL"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-button_text">Button Text</Label>
                <Input
                  id="edit-button_text"
                  value={formData.button_text}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, button_text: e.target.value }))
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
                    setFormData((prev) => ({ ...prev, button_link: e.target.value }))
                  }
                  placeholder="/shop"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-text_color">Text Color</Label>
                <Select
                  value={formData.text_color}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, text_color: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="primary">Primary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-overlay_opacity">Overlay Opacity (%)</Label>
                <Input
                  id="edit-overlay_opacity"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.overlay_opacity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, overlay_opacity: parseInt(e.target.value) || 0 }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-display_order">Display Order</Label>
                <Input
                  id="edit-display_order"
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))
                  }
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
              <Label htmlFor="edit-is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setIsEditDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditBanner}
              disabled={isSubmitting || !formData.title}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{bannerToDelete?.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setBannerToDelete(null);
                setIsDeleteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBanner}
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBannerManagement;