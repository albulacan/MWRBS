package com.itl.mwrbs.helpers;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import org.springframework.util.StringUtils;

public class FileUploadHelper {
	
	public static String uploadFile(String referenceNo, String base64, String fileName, String basePath) throws Exception {
		if (StringUtils.isEmpty(base64) || base64.equals("data")) {
			throw new Exception("Invalid base64 file.");
		}
		if (fileName == null || fileName == "") {
			throw new Exception("Invalid file name.");
		}
		byte[] base64Byte = Base64.getMimeDecoder().decode(base64.split(",")[1]);
		String strPath = String.format("%s/%s/", basePath, referenceNo);
		Path path = Paths.get(strPath);
		Path file = Paths.get(strPath + fileName);

		if (!Files.exists(path)) {
			Files.createDirectories(path);
		}

		int fileCount = new File(strPath).list().length;
		int i = 1;
		while (i <= fileCount) {
			if (Files.exists(file)) {
				if (fileName.contains(String.format("(%d)", i - 1))) {
					fileName = fileName.replace(String.format("(%d)", i - 1), "");
				}
				int extentionIndex = fileName.lastIndexOf('.');
				fileName = String.format("%s(%d)%s", fileName.substring(0, extentionIndex), i,
						fileName.substring(extentionIndex));
				file = Paths.get(strPath + fileName);
			} else {
				break;
			}
			i++;
		}

		Files.write(file, base64Byte);
		
		return strPath + fileName;
	}
	
	public static String getFileName(String path) {
		File file = new File(path);  
		return file.getAbsolutePath().substring(file.getAbsolutePath().lastIndexOf("\\") + 1);
	}

}
