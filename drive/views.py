from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes



class CreateFolderView(generics.CreateAPIView):
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_folder_contents(request):
    parent_id = request.query_params.get('parent')
    user = request.user

    folders = Folder.objects.filter(owner=user, parent_id=parent_id)
    files = File.objects.filter(owner=user, folder_id=parent_id)

    folder_data = FolderSerializer(folders, many=True).data
    file_data = FileSerializer(files, many=True).data

    return Response({
        "folders": folder_data,
        "files": file_data
    })


class FolderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FolderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Folder.objects.filter(owner=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_parent_folders(request):
    user = request.user
    parent_folders = Folder.objects.filter(owner=user, parent__isnull=True)
    serializer = FolderSerializer(parent_folders, many=True)
    return Response(serializer.data)



# FILE CRUD

class UploadFileView(generics.CreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES.get("file")
        original_name = uploaded_file.name if uploaded_file else None
        serializer.save(owner=self.request.user, name=original_name)

class ListFilesView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        folder_id = self.request.query_params.get('folder')
        return File.objects.filter(owner=self.request.user, folder_id=folder_id)

class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(owner=self.request.user)
