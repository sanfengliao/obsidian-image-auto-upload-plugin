import { join } from "path";

import { normalizePath, FileSystemAdapter } from "obsidian";

import type imageAutoUploadPlugin from "../main";
import type { Image } from "../types";
import type { PluginSettings } from "../setting";
import type { Uploader } from "./types";
import { PicGo } from 'picgo'

export default class PicGoCoreUploader implements Uploader {
  settings: PluginSettings;
  plugin: imageAutoUploadPlugin;
  picgo: PicGo = new PicGo()

  constructor(plugin: imageAutoUploadPlugin) {
    this.settings = plugin.settings;
    this.plugin = plugin;
  }

  private async uploadFiles(fileList: Array<Image> | Array<string>) {
    const basePath = (
      this.plugin.app.vault.adapter as FileSystemAdapter
    ).getBasePath();

    const list = fileList.map(item => {
      if (typeof item === "string") {
        return item;
      } else {
        return normalizePath(join(basePath, item.path));
      }
    });

   

    const res = await this.picgo.upload(list);

    if (Array.isArray(res)) {
      return {
        success: true,
        result: res.map(item => item.imgUrl).filter(url => !!url),
      };
    } else {
      return {
        success: false,
        msg: "失败",
        result: [] as string[],
      };
    }
  }

  // PicGo-Core 上传处理
  private async uploadFileByClipboard() {
    const res = await this.picgo.upload();
    if (Array.isArray(res)) {
      const imgUrls = res.map(item => item.imgUrl).filter(url => !!url);
      return {
        success: true,
        msg: "success",
        code: 0,
        result: imgUrls,
        data: imgUrls[0]
      }
    }
    return {
        success: false,
        msg: res.message,
        code: 0,
        result: [],
        data: ""
    }
  }

 




  async upload(fileList: Array<Image> | Array<string>) {
    return this.uploadFiles(fileList);
  }
  async uploadByClipboard(fileList?: FileList) {
    console.log("uploadByClipboard", fileList);
    return this.uploadFileByClipboard();
  }
}
