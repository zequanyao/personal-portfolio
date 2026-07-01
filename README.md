# 个人主页

这是一个可直接发布到 GitHub Pages 的静态个人网站。访客只能浏览；只有拥有 GitHub 仓库写入权限的人才能修改。

## 修改内容

主要文字集中在 `data/content.js`。修改后提交并推送到 `main` 分支，GitHub Actions 会自动发布新版本。

论文首页和证书图片放入 `assets/previews/`，然后在 `data/content.js` 中填写对应路径。建议使用经过压缩的 WebP 或 JPEG，并先遮盖编号、二维码、签名等敏感信息。

## 首次发布

1. 在 GitHub 新建一个公开仓库。若希望网址为 `用户名.github.io`，仓库名也应为 `用户名.github.io`。
2. 将本目录中的所有文件提交并推送到仓库的 `main` 分支。
3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
5. 打开仓库的 **Actions** 页面，等待 `Deploy website to GitHub Pages` 完成。

发布地址通常为：

- 用户主页仓库：`https://用户名.github.io/`
- 普通项目仓库：`https://用户名.github.io/仓库名/`

## 本地预览

在本目录运行：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000`。
