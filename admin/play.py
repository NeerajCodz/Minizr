import os

def display_directory(directory, indent=''):
    """
    Display directory structure recursively.
    """
    print(indent + os.path.basename(directory) + os.sep)
    indent += '    '
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        if os.path.isdir(item_path):
            display_directory(item_path, indent)
        else:
            print(indent + item)

# Replace 'path_to_your_directory' with the path of the directory you want to display
directory_path = 'D:/codz/Minizr/admin/src'

if os.path.exists(directory_path):
    display_directory(directory_path)
else:
    print("Directory not found.")
