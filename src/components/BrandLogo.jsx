export default function BrandLogo({ variant = "nav" }) {
	return (
		<span
			className={`brand-wordmark brand-wordmark--${variant} font-quranic`}
			dir="rtl"
			lang="ar"
		>
			الأثار
		</span>
	);
}
