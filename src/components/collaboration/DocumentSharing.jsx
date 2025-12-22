import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Upload, FileText, Download, Trash2, Loader2, File, Image, FileVideo } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

const getFileIcon = (fileType) => {
  if (fileType?.startsWith('image/')) return Image;
  if (fileType?.startsWith('video/')) return FileVideo;
  return FileText;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export default function DocumentSharing({ projectId }) {
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => base44.entities.Document.filter({ project_id: projectId }, '-created_date'),
    enabled: !!projectId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Document.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      await base44.entities.Document.create({
        project_id: projectId,
        file_url,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: currentUser?.email,
        description
      });

      queryClient.invalidateQueries({ queryKey: ['documents', projectId] });
      setShowUpload(false);
      setFile(null);
      setDescription('');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Documenten</h3>
        <Button
          onClick={() => setShowUpload(true)}
          className="bg-emerald-500 hover:bg-emerald-600 gap-2"
          size="sm"
        >
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-8 bg-[#1a1d21] rounded-lg border border-gray-800">
          <File className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Nog geen documenten</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {documents.map(doc => {
            const Icon = getFileIcon(doc.file_type);
            
            return (
              <div key={doc.id} className="bg-[#1a1d21] rounded-lg p-4 border border-gray-800 flex items-center justify-between hover:bg-[#22262b] transition-colors">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{doc.file_name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatFileSize(doc.file_size)}</span>
                      <span>•</span>
                      <span>{format(new Date(doc.created_date), 'dd MMM yyyy', { locale: nl })}</span>
                      <span>•</span>
                      <span>{doc.uploaded_by}</span>
                    </div>
                    {doc.description && (
                      <p className="text-xs text-gray-400 mt-1 truncate">{doc.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-emerald-400">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                  
                  {doc.uploaded_by === currentUser?.email && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(doc.id)}
                      className="h-8 w-8 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="bg-[#22262b] border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Document Uploaden</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label>Bestand *</Label>
              <Input
                type="file"
                onChange={handleFileChange}
                className="bg-[#1a1d21] border-gray-700"
                required
              />
              {file && (
                <p className="text-sm text-gray-400">
                  {file.name} ({formatFileSize(file.size)})
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Beschrijving (optioneel)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Korte beschrijving..."
                className="bg-[#1a1d21] border-gray-700"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUpload(false)}
                className="border-gray-600 text-gray-300"
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={!file || uploading}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploaden...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}