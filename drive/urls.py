from django.urls import path
from .views import *

urlpatterns = [
    # Folder
    path('folders/create/', CreateFolderView.as_view(), name='create-folder'),
    path('folders/list/', list_folder_contents, name='folder-contents'),
    path('folders/parents/', list_parent_folders, name='list-parent-folders'),
    path('folders/<int:pk>/', FolderDetailView.as_view(), name='folder-detail'),

    # File
    path('files/upload/', UploadFileView.as_view(), name='upload-file'),
    path('files/list/', ListFilesView.as_view(), name='list-files'),
    path('files/<int:pk>/', FileDetailView.as_view(), name='file-detail'),
]
 