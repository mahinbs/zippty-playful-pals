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
  EyeOff,
  Image,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { bannersService, AdminBanner, BannerInsert } from "@/services/banners";
import { toast } from "sonner";

const AdminBannerManagement = () => {
  const [banners, setBanners] = useState<AdminBanner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<AdminBanner | null>(null);

  const initialFormData = {
    title: "",
    subtitle: "",
    description: "",
    button_text: "Shop Now",
    button_link: "/shop",
    background_image: "",
    overlay_opacity: 30,
    text_color: "white",
    is_active: true,
    display_order: 0,
  };

  const [formData, setFormData] = useState(initialFormData);

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
    setFormData(initialFormData);
    setEditingBanner(null);
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
        overlay_opacity: formData.overlay_opacity,
        text_color: formData.text_color,
        is_active: formData.is_active,
        display_order: formData.display_order,
      };

      await bannersService.addBanner(bannerData);
      await loadBanners();
      
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
      
      const updates = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        button_text: formData.button_text,
        button_link: formData.button_link,
        background_image: formData.background_image || null,
        overlay_opacity: formData.overlay_opacity,
        text_color: formData.text_color,
        is_active: formData.is_active,
        display_order: formData.display_order,
      };

      await bannersService.updateBanner(editingBanner.id, updates);
      await loadBanners();
      
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
      await loadBanners();
      
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

  const toggleBannerStatus = async (banner: AdminBanner) => {
    try {
      await bannersService.toggleBannerStatus(banner.id, !banner.is_active);
      await loadBanners();
      toast.success(`Banner ${!banner.is_active ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error("Error toggling banner status:", error);
      toast.error("Failed to update banner status");
    }
  };

  const openEditDialog = (banner: AdminBanner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      button_text: banner.button_text,
      button_link: banner.button_link,
      background_image: banner.background_image || "",
      overlay_opacity: banner.overlay_opacity,
      text_color: banner.text_color,
      is_active: banner.is_active,
      display_order: banner.display_order,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (banner: AdminBanner) => {
    setBannerToDelete(banner);
    setIsDeleteDialogOpen(true);
  };

  const BannerForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Banner title"
          required
        />
      </div>

      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          placeholder="Banner subtitle"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Banner description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="button_text">Button Text</Label>
          <Input
            id="button_text"
            value={formData.button_text}
            onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
            placeholder="Shop Now"
          />
        </div>

        <div>
          <Label htmlFor="button_link">Button Link</Label>
          <Input
            id="button_link"
            value={formData.button_link}
            onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
            placeholder="/shop"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="background_image">Background Image URL</Label>
        <Input
          id="background_image"
          value={formData.background_image}
          onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="overlay_opacity">Overlay Opacity (%)</Label>
          <Input
            id="overlay_opacity"
            type="number"
            min="0"
            max="100"
            value={formData.overlay_opacity}
            onChange={(e) => setFormData({ ...formData, overlay_opacity: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label htmlFor="display_order">Display Order</Label>
          <Input
            id="display_order"
            type="number"
            value={formData.display_order}
            onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="text_color">Text Color</Label>
        <Select
          value={formData.text_color}
          onValueChange={(value) => setFormData({ ...formData, text_color: value })}
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

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Banner Management</h2>
          <p className="text-muted-foreground">
            Manage banners displayed on the home page
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Banner</DialogTitle>
              <DialogDescription>
                Create a new banner for the home page hero section.
              </DialogDescription>
            </DialogHeader>
            <BannerForm />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddBanner} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Banner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading banners...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {banner.title}
                      <Badge variant={banner.is_active ? "default" : "secondary"}>
                        {banner.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </CardTitle>
                    {banner.subtitle && (
                      <CardDescription>{banner.subtitle}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleBannerStatus(banner)}
                    >
                      {banner.is_active ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
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
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {banner.description && (
                    <p className="text-sm text-muted-foreground">{banner.description}</p>
                  )}
                  <div className="flex gap-4 text-sm">
                    <span>Button: {banner.button_text}</span>
                    <span>Link: {banner.button_link}</span>
                    <span>Order: {banner.display_order}</span>
                  </div>
                  {banner.background_image && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Image className="h-4 w-4" />
                      Background image set
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {banners.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No banners created yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first banner to display on the home page.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Update the banner details.
            </DialogDescription>
          </DialogHeader>
          <BannerForm />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditBanner} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Banner"}
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
              Are you sure you want to delete "{bannerToDelete?.title}"? This action cannot be undone.
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
              {isSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBannerManagement;