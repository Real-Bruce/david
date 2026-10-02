---
title: 使用 Java Graphics2D 为图片添加文字水印
description: 封装 Graphics2D 实现图片文字水印：按图片分辨率自适应字号、三角函数计算水印坐标，并解决 Linux 环境中文字体缺失问题。
pubDate: 2024-10-16
tags:
  - Java
  - Graphics2D
draft: false
---

最近做的需求涉及到给图片添加水印的需求，做了一点基本的封装，基本能满足简单的图片水印处理需求，现在把处理的思路和代码分享一下希望能帮到各位同学~\(≧▽≦)/~

## 🌎主方法生成 `Graphics2D` 对象，并设置相关的样式

`Graphics2D` 的使用方法，可以查看对应的 API 在 `java.awt.Graphics2D` 类下，有详细的使用说明介绍，此处不再进行复述。

> 此处推荐一个查看 Java8 API 的网站，[Java8中文API查看](https://www.matools.com/api/java8)

```java
public static void waterMark(String srcImgPath,String watermarkContent, double angle, String outPath) {
    Graphics2D graphics2D = null;
    try {
        // 生成2D画布
        BufferedImage targetImg = ImageIO.read(new File(srcImgPath));
        int imgHeight = targetImg.getHeight();
        int imgWidth = targetImg.getWidth();
        BufferedImage bufferedImage = new BufferedImage(imgWidth, imgHeight, BufferedImage.TYPE_INT_BGR);
        graphics2D = bufferedImage.createGraphics();
        graphics2D.drawImage(targetImg, 0, 0, imgWidth, imgHeight, null);

        // 设置水印样式
        graphics2D.getDeviceConfiguration().createCompatibleImage(imgWidth, imgHeight, Transparency.TRANSLUCENT);
        Font font = getContentFont(imgWidth, imgHeight, angle, watermarkContent, graphics2D);
        graphics2D.setColor(Color.lightGray);
        graphics2D.setFont(font);

        // 设置水印位置和角度
        int[] waterImg = waterImg(imgWidth, imgHeight, angle, font, watermarkContent, graphics2D);
        int x = waterImg[0];
        int y = waterImg[1];
        graphics2D.rotate(Math.toRadians(angle), x, y);

        // 绘制水印到目标图
        graphics2D.drawString(watermarkContent, x, y);
        FileOutputStream outImgStream = new FileOutputStream(outPath);
        ImageIO.write(bufferedImage, "jpg", outImgStream);
        System.out.println("图片水印添加完成，文件输出路径:" + outPath);

    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        assert graphics2D != null;
        graphics2D.dispose();
    }
}
```

## 🚀【生成水印文字大小的方法】

- 根据文字的长度和角度利用三角函数计算水印在旋转后的长宽，并进行加权计算得到水印的占比情况；
- 将水印的占比情况与需要添加水印图片的长宽机型比较得到合适的水印文字大小；

```java
public static Font getContentFont(int imgWidth, int imgHeight, double angle, String waterContent, Graphics2D graphics2D) {
    int contentWidth = 0;
    int contentHeight = 0;
    Font font = null;

    for (int i = 60; i > 0; i--) {
        font = new Font("微软雅黑", Font.PLAIN, i);
        int contentLength = graphics2D.getFontMetrics(font).charsWidth(waterContent.toCharArray(), 0, waterContent.length());
        contentWidth = (int) (contentLength *  (- Math.cos(angle))) + imgWidth / 2;
        contentHeight = (int) (contentLength *  (- Math.sin(angle))) + imgHeight / 2;
        if (contentWidth < imgWidth && contentHeight < imgHeight) {
            break;
        }
    }
    return font;
}
```

## ⛵【生成水印坐标的方法】

- 根据文字水印的长度和角度利用三角函数计算水印的占比情况；
- 并将水印的起始生成坐标定为图片的下半部分；

> `Graphics2D` 生成图片时的原点坐标：
>
> 1. 方形：方形的原点坐标位于左上角（图片本身都是方形，因此在图像中绘制另一张图片时，图片的原点坐标也在左上角）
> 2. 椭圆形： 椭圆形的原点坐标位于圆心
> 3. 文字：文字的原点坐标位于左侧与基线的交点上（参考后面绘制文字）

```java
public static int[] waterImg(int imgWidth, int imgHeight, double angle, Font font, String waterContent, Graphics2D graphics2D) {
    int[] waterImg = new int [2];
    int contentLength = graphics2D.getFontMetrics(font).charsWidth(waterContent.toCharArray(), 0, waterContent.length());
    int contentWidth = (int) (contentLength *  (- Math.cos(angle)));
    int contentHeight = (int) (contentLength *  (- Math.sin(angle)));
    waterImg[0] = (imgWidth - 2 * contentWidth) / 4;
    waterImg[1] = imgHeight / 4 + contentHeight;
    return waterImg;
}
```

功能发布到测试环境才发现有个坑，测试环境的水印中文全都没加载出来🙄

产生问题的原因如下：

1. 程序中应用的微软雅黑字体在 Linux 系统是没有的；
2. Linux 环境的字体大部分不支持中文；
3. 而在本地开发环境，字体都是系统提供的因此不会发生中文不加载的问题

## 🍗【优化后的字体加载方法】

- 利用 `this.getClass().getClassLoader().getResourceAsStream()` 方法加载资源包内的字体文件；
- 调用 `Font.createFont()` 方法导入本地的字体； 
- 通过 `graphicsEnvironment.registerFont()` 方法将资源包内的字体注册到画图对象内；

> 此处还有一个坑🌚
>
> Font 提供的 `deriveFont()` 方法每次会复制产生一个新的 Font 对象，所以每次修改字体大小后需要生成新的 Font，要不然拿到的字体大小都是 `size = 1`；
>
> 推荐一个对中文支持很好的开源字体：[得意黑](https://github.com/atelier-anchor/smiley-sans)

```
/**
 * 加载字体文件，根据图片分辨率计算水印的文字大小
 * @return Font
 */
private Font loadFontResource(int imgWidth, int imgHeight, double angle, String waterContent, Graphics2D graphics2D, BufferedImage imgBuffer) {
    Font font = null;
    try {
        // 加载外部字体
        InputStream resourceAsStream = this.getClass().getClassLoader().getResourceAsStream("font/SmileySans-Oblique.ttf");
        assert resourceAsStream != null;
        Font sourceFont = Font.createFont(Font.TRUETYPE_FONT, resourceAsStream);
        // 注册外部字体
        GraphicsEnvironment graphicsEnvironment = GraphicsEnvironment.getLocalGraphicsEnvironment();
        graphicsEnvironment.registerFont(sourceFont);
        graphics2D = graphicsEnvironment.createGraphics(imgBuffer);

        int contentWidth = 0;
        int contentHeight = 0;
        for (int i = 60; i > 1; i--) {
            font = sourceFont.deriveFont(Font.PLAIN, i);
            int contentLength = graphics2D.getFontMetrics(font).charsWidth(waterContent.toCharArray(), 0, waterContent.length());
            contentWidth = (int) (contentLength *  (- Math.cos(angle))) + imgWidth / 2;
            contentHeight = (int) (contentLength *  (- Math.sin(angle))) + imgHeight / 2;
            if (contentWidth < imgWidth && contentHeight < imgHeight) {
                break;
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return font;
}
```

## 🌈【完整代码】

```java
package cn.bruce.graphics;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

/**
 * @author Bruce
 * @create 2023/06/14
 * @description
 */
public class Graphics2DToWaterMark {
    /**
     * 生成水印程序
     * @param srcImgPath 图片路径
     * @param watermarkContent 水印文字内容
     * @param angle 旋转角度
     * @param outPath 带水印图输出路径
     */
    public void waterMark(String srcImgPath,String watermarkContent, double angle, String outPath) {
        Graphics2D graphics2D = null;
        try {
            // 生成2D画布
            BufferedImage targetImg = ImageIO.read(new File(srcImgPath));
            int imgHeight = targetImg.getHeight();
            int imgWidth = targetImg.getWidth();
            BufferedImage bufferedImage = new BufferedImage(imgWidth, imgHeight, BufferedImage.TYPE_INT_BGR);
            graphics2D = bufferedImage.createGraphics();
            graphics2D.drawImage(targetImg, 0, 0, imgWidth, imgHeight, null);

            // 设置水印样式
            graphics2D.getDeviceConfiguration().createCompatibleImage(imgWidth, imgHeight, Transparency.TRANSLUCENT);
            Font font = this.loadFontResource(imgWidth, imgHeight, angle, watermarkContent, graphics2D, bufferedImage);
            graphics2D.setColor(Color.lightGray);
            graphics2D.setFont(font);

            // 设置水印位置和角度
            int[] waterImg = waterImg(imgWidth, imgHeight, angle, font, watermarkContent, graphics2D);
            int x = waterImg[0];
            int y = waterImg[1];
            graphics2D.rotate(Math.toRadians(angle), x, y);

            // 绘制水印到目标图
            graphics2D.drawString(watermarkContent, x, y);
            FileOutputStream outImgStream = new FileOutputStream(outPath);
            ImageIO.write(bufferedImage, "jpg", outImgStream);
            System.out.println("图片水印添加完成，文件输出路径:" + outPath);

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            assert graphics2D != null;
            graphics2D.dispose();
        }
    }

    /**
     * 根据图片分辨率计算水印的文字大小
     * @param imgWidth 图片宽度
     * @param imgHeight 图片高度
     * @return 字体大小
     */
    @Deprecated
    private Font getContentFont(int imgWidth, int imgHeight, double angle, String waterContent, Graphics2D graphics2D) {
        int contentWidth = 0;
        int contentHeight = 0;
        Font font = null;

        for (int i = 60; i > 0; i--) {
            font = new Font("Amatic SC", Font.BOLD, i);
            int contentLength = graphics2D.getFontMetrics(font).charsWidth(waterContent.toCharArray(), 0, waterContent.length());
            contentWidth = (int) (contentLength *  (- Math.cos(angle))) + imgWidth / 2;
            contentHeight = (int) (contentLength *  (- Math.sin(angle))) + imgHeight / 2;
            if (contentWidth < imgWidth && contentHeight < imgHeight) {
                break;
            }
        }
        return font;
    }

    /**
     * 计算水印生成位置坐标
     * @param imgWidth 图片宽度
     * @param imgHeight 图片高度
     * @param angle 旋转角度
     * @param font 文字大小
     * @param waterContent 水印内容
     * @return 水印生成位置坐标
     */
    private int[] waterImg(int imgWidth, int imgHeight, double angle, Font font, String waterContent, Graphics2D graphics2D) {
        int[] waterImg = new int [2];
        int contentLength = graphics2D.getFontMetrics(font).charsWidth(waterContent.toCharArray(), 0, waterContent.length());
        int contentWidth = (int) (contentLength *  (- Math.cos(angle)));
        int contentHeight = (int) (contentLength *  (- Math.sin(angle)));
        waterImg[0] = (imgWidth - 2 * contentWidth) / 4;
        waterImg[1] = imgHeight / 4 + contentHeight;
        return waterImg;
    }

    /**
     * 加载字体文件，根据图片分辨率计算水印的文字大小
     * @return Font
     */
    private Font loadFontResource(int imgWidth, int imgHeight, double angle, String waterContent, Graphics2D graphics2D, BufferedImage imgBuffer) {
        Font font = null;
        try {
            // 加载外部字体
            InputStream resourceAsStream = this.getClass().getClassLoader().getResourceAsStream("font/SmileySans-Oblique.ttf");
            assert resourceAsStream != null;
            Font sourceFont = Font.createFont(Font.TRUETYPE_FONT, resourceAsStream);
            // 注册外部字体
            GraphicsEnvironment graphicsEnvironment = GraphicsEnvironment.getLocalGraphicsEnvironment();
            graphicsEnvironment.registerFont(sourceFont);
            graphics2D = graphicsEnvironment.createGraphics(imgBuffer);

            int contentWidth = 0;
            int contentHeight = 0;
            for (int i = 60; i > 1; i--) {
                font = sourceFont.deriveFont(Font.PLAIN, i);
                int contentLength = graphics2D.getFontMetrics(font).charsWidth(waterContent.toCharArray(), 0, waterContent.length());
                contentWidth = (int) (contentLength *  (- Math.cos(angle))) + imgWidth / 2;
                contentHeight = (int) (contentLength *  (- Math.sin(angle))) + imgHeight / 2;
                if (contentWidth < imgWidth && contentHeight < imgHeight) {
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return font;
    }
}

```

【调用测试】

```java
package cn.bruce.graphics;

public class TestGraphics2D {

    public static void main(String[] args) {
        String srcImagePath = "E:\\workspace\\workspace05\\demo\\watermark\\src\\main\\resources\\test02.jpg";
        String targetPath = "E:\\workspace\\workspace05\\demo\\watermark\\src\\main\\resources\\test_watermark.jpg";

        String watermarkContent = "此图片xxx版权所有，如需商用请联系xxx";
        Graphics2DToWaterMark graphics2Dtowatermark = new Graphics2DToWaterMark();

        graphics2Dtowatermark.waterMark(srcImagePath,watermarkContent, 325.0, targetPath);
    }
}

```
