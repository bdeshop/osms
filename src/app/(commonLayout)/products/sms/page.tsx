import ChallengeSection from "@/components/pages/products/ChallengeSection"
import HeroProducts from "@/components/pages/products/HeroProducts"
import LaaffficSMSEnhanceSection from "@/components/pages/products/LaaffficSMSEnhanceSection"
import SMSFeaturesSection from "@/components/pages/products/SMSFeaturesSection"
import SMSMarketingGains from "@/components/pages/products/SMSMarketingGains"

const page = () => {
    return (
        <div>
            <HeroProducts />
            <ChallengeSection/>
            <SMSMarketingGains/>
            <SMSFeaturesSection/>
            <LaaffficSMSEnhanceSection/>
            
        </div>
    )
}

export default page