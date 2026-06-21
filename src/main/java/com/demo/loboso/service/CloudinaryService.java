package com.demo.loboso.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    @Value("${cloudinary.folder}")
    private String folder;

    public Map uploadImage(MultipartFile file, String publicId) throws IOException {
        Map params = ObjectUtils.asMap(
            "folder", folder,
            "public_id", publicId != null ? publicId : System.currentTimeMillis(),
            "overwrite", true
        );
        return cloudinary.uploader().upload(file.getBytes(), params);
    }

    public Map uploadImage(MultipartFile file) throws IOException {
        return uploadImage(file, null);
    }

    public void deleteImage(String publicId) throws IOException {
        if (publicId != null && !publicId.isEmpty()) {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        }
    }

    public String getImageUrl(String publicId) {
        return cloudinary.url().generate(publicId);
    }
}