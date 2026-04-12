import { Helmet } from "react-helmet-async";

const ForSeo = ({
    title,
    description,
    keywords,
    path = "",
    type = "website",
    image = "https://www.nexturncomponentcraft.com/nexturn.png",
    imageAlt = "Nexturn Component Craft",
    author = "Nexturn Component Craft",
    serviceSchema,
}) => {
    const BASE_URL = "https://www.nexturncomponentcraft.com";
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${BASE_URL}${normalizedPath}`;


    const schema = serviceSchema
        ? {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": serviceSchema.serviceName,
            "description": serviceSchema.serviceDescription,
            "provider": {
                "@type": "Organization",
                "name": "Nexturn Component Craft",
                "url": BASE_URL
            },
            "url": url
        }
        : null;



    return (
        <Helmet>
            {/* Basic SEO */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:image:alt" content={imageAlt} />
            <meta property="og:site_name" content="Nexturn Component Craft" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:image:alt" content={imageAlt} />

            {/* JSON-LD */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default ForSeo;