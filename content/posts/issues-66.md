---
title: 'SpringBoot 集成 MapStruct'
date: 2022-04-29T10:28:36Z
tags: []

---

# 集成步骤
## 1. 引入依赖
```
<!-- 样例 https://github.com/mapstruct/mapstruct-examples/blob/master/mapstruct-lombok/pom.xml -->
<properties>  
	<java.version>1.8</java.version>
	<!-- mapstruct 版本 -->
	<org.mapstruct.version>1.4.2.Final</org.mapstruct.version>
	<!-- lombok 1.18.16 版本之后用 -->
	<lombok-mapstruct-binding.version>0.2.0</lombok-mapstruct-binding.version>
	<!-- lombok 版本 -->
	<org.projectlombok.verion>1.18.22</org.projectlombok.verion>
</properties>

<dependencies>
	<dependency>  
		<groupId>org.springframework.boot</groupId>  
		<artifactId>spring-boot-starter-web</artifactId>  
	</dependency>
	
	<!-- 引入 mapstruct -->
	<dependency>  
		<groupId>org.mapstruct</groupId>  
		<artifactId>mapstruct</artifactId>  
		<version>${org.mapstruct.version}</version>  
	</dependency>
	
	<!-- 引入 lombok -->
	<dependency>
		<groupId>org.projectlombok</groupId>  
		<artifactId>lombok</artifactId>  
		<version>${org.projectlombok.verion}</version>  
	</dependency>  
</dependencies>

<build>  
	<plugins>  
		<plugin>  
			<groupId>org.springframework.boot</groupId>  
			<artifactId>spring-boot-maven-plugin</artifactId>  
		</plugin>
		<plugin>  
			<groupId>org.apache.maven.plugins</groupId>  
			<artifactId>maven-compiler-plugin</artifactId>  
			<version>3.8.1</version>  
			<configuration>  
				<source>1.8</source>
				<target>1.8</target>
				<annotationProcessorPaths>  
				<!-- mapstruct 插件 -->
				<path>  
					<groupId>org.mapstruct</groupId>  
					<artifactId>mapstruct-processor</artifactId>  
					<version>${org.mapstruct.version}</version>  
				</path>  
				<!-- lombok 插件 -->
				<path>  
					<groupId>org.projectlombok</groupId>  
					<artifactId>lombok</artifactId>  
					<version>${org.projectlombok.verion}</version>  
				</path>
				<path>
					<groupId>org.projectlombok</groupId>
					<artifactId>lombok-mapstruct-binding</artifactId>
					<version>${lombok-mapstruct-binding.version}</version>
				</path>
				<!-- other annotation processors -->  
				</annotationProcessorPaths>  
				<compilerArgs>  
					<!-- mapstruct 配置，使得定义的 Mapper 可通过 @Resource 注解注入 -->
					<arg>
						-Amapstruct.defaultComponentModel=spring  
					</arg>  
				</compilerArgs>
			</configuration>  
		</plugin>  
	</plugins>  
</build>
```

## 2. 定义模型及模型转换接口
```
@Data  
public class Source {  
	private String k;  
}

@Data  
public class Destination {  
	private String k;  
}

@Mapper(componentModel = "spring")  
public interface Converter {  
	Destination convertToDestination(Source s);  
}

```

## 3. 使用模型转换器
```
import static org.junit.Assert.assertEquals;

@SpringBootTest
class ConverterTest {
	// 自动注入
	@Resource
	private Converter converter;
	
	@Test
	public test() {
		Source source = new Source();  
		source.setK(UUID.randomUUID().toString());  
		Destination destination = myMapper.to(source);
		assertEquals(destination.getK(), source.getK());
	}
}
```
# 常见场景及解决方案
- [对象转换工具 MapStruct 介绍](https://juejin.cn/post/6994233847076356133#heading-7)
- [还用 BeanUtils 拷贝对象？MapStruct 才是王者！一文玩转 MapStruct 全场景](https://blog.lupf.cn/articles/2021/06/11/1623373787754.html)


# 参考链接
- [MapStruct 官网](https://mapstruct.org/)
- [MapStruct FAQ: Can I use MapStruct together with Project Lombok?](https://mapstruct.org/faq/#Can-I-use-MapStruct-together-with-Project-Lombok)
- [MapStruct 官方文档](https://mapstruct.org/documentation/stable/reference/html/)
- [# 七种对象复制工具类，阿粉该 Pick 谁？](https://www.justdojava.com/2020/08/23/beancopy/)