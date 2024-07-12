export enum LabelType {
    FUNNY = "FUNNY",
    BUGGY = "BUGGY",
    PROFESSIONAL = "PROFESSIONAL",
    VALUED = "VALUED",
}

export interface LabelWithVote {
    label: LabelType
    vote: number
}

export interface ThreadContent {
    query: string;
    response: string;
    labelsWithVote: Array<LabelWithVote>;
}

export const mockThreadContents: ThreadContent[] = [
    {
        query: "How does climate change affect global biodiversity and ecosystems?",
        response: "Climate change poses significant threats to global biodiversity and ecosystems, including habitat loss, species extinction, altered migration patterns, disrupted food chains, and increased frequency of extreme weather events.",
        labelsWithVote: [
            { label: LabelType.PROFESSIONAL, vote: 9 }
        ]
    },
    {
        query: "What are the key principles of effective leadership in a dynamic business environment?",
        response: "Effective leadership in a dynamic business environment involves vision-setting, decision-making, delegation, communication skills, empathy, adaptability, and fostering a collaborative and innovative culture.",
        labelsWithVote: [
            { label: LabelType.PROFESSIONAL, vote: 10 },
            { label: LabelType.VALUED, vote: 8 }
        ]
    },
    {
        query: "How can artificial intelligence revolutionize healthcare delivery and patient care?",
        response: "Artificial intelligence has the potential to transform healthcare by enabling personalized treatment plans, predictive analytics, automated diagnostics, medical image analysis, and administrative efficiency.",
        labelsWithVote: [
            { label: LabelType.PROFESSIONAL, vote: 9 },
            { label: LabelType.VALUED, vote: 7 }
        ]
    },
    {
        query: "What are the ethical implications of genetic engineering in agriculture and food production?",
        response: "Genetic engineering in agriculture raises ethical concerns related to environmental impact, biodiversity, food safety, socioeconomic disparities, and the rights of future generations.",
        labelsWithVote: [
            { label: LabelType.PROFESSIONAL, vote: 7 }
        ]
    },
    {
        query: "How does mindfulness meditation improve mental health and well-being?",
        response: "Mindfulness meditation enhances mental health by reducing stress, anxiety, and depression, improving emotional regulation, increasing resilience, and promoting overall well-being.",
        labelsWithVote: [
            { label: LabelType.VALUED, vote: 8 }
        ]
    },
    {
        query: "What are the main challenges faced by businesses in digital transformation?",
        response: "Digital transformation challenges include resistance to change, legacy systems integration, cybersecurity risks, talent acquisition, cultural shifts, and ensuring ROI on technology investments.",
        labelsWithVote: [
            { label: LabelType.PROFESSIONAL, vote: 9 },
            { label: LabelType.VALUED, vote: 7 }
        ]
    },
    {
        query: "How can effective project management ensure successful project outcomes?",
        response: "Effective project management involves planning, scheduling, resource allocation, risk management, communication, and monitoring to achieve project goals on time and within budget.",
        labelsWithVote: [
            { label: LabelType.PROFESSIONAL, vote: 8 },
            { label: LabelType.VALUED, vote: 7 }
        ]
    },
    {
        query: "What are the key factors influencing consumer behavior in the digital age?",
        response: "Consumer behavior in the digital age is influenced by factors such as online reviews, social media, brand reputation, convenience, personalization, and ethical considerations.",
        labelsWithVote: [
            { label: LabelType.PROFESSIONAL, vote: 7 }
        ]
    },
    {
        query: "How can businesses effectively leverage data analytics for decision-making?",
        response: "Data analytics enables businesses to gain insights, identify trends, predict outcomes, optimize processes, personalize marketing strategies, and make data-driven decisions.",
        labelsWithVote: [
            { label: LabelType.PROFESSIONAL, vote: 9 }
        ]
    },
    {
        query: "What are the emerging trends in technology that will shape the future of work?",
        response: "Emerging technology trends such as artificial intelligence, blockchain, Internet of Things (IoT), remote work technologies, and augmented reality are transforming the future of work and business operations.",
        labelsWithVote: [
            { label: LabelType.PROFESSIONAL, vote: 8 },
            { label: LabelType.VALUED, vote: 7 }
        ]
    }
];
