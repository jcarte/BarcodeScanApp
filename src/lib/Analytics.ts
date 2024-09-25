import PostHog, { usePostHog } from "posthog-react-native";

export class Analytics {
    analytics: PostHog
    constructor() {
        this.analytics = usePostHog()
    }

    logBarcodeScanned(
        barcode: string,
        productLookupStatus: "error" | "incomplete" | "notFound" | "ok",
        level?: "avoid" | "warning" | "ok") {

        //log both (mostly because of legacy)
        this.analytics.capture('bsa_scan_barcode', {
            barcode: barcode,
            status: productLookupStatus,
        })
        this.analytics.capture('bsa_scan_status_' + productLookupStatus, {
            barcode: barcode
        })

        //actually got results
        if (level) {
            const level_num = level === "avoid"
                ? 3
                : level === "warning"
                    ? 2
                    : 1

            this.analytics.capture('bsa_scan_result_rag_' + level_num, {
                barcode: barcode
            })
        }
    }

    logBottomSheetExpanded() {
        this.analytics.capture('bsa_bottom_sheet_maximise')
    }

    logBottomSheetCollapsed() {
        this.analytics.capture('bsa_bottom_sheet_minimise')
    }

    logOnboardingPageCompleted(pageTitle: string) {
        this.analytics.capture('bsa_onboarding_completed_' + pageTitle)
    }

    logAboutPageView() {
        this.analytics.capture('bsa_about_view')
    }

    logAboutPageClickUpdateTriggers() {
        this.analytics.capture('bsa_about_click_updateTriggers')
    }

    logAboutPageClickSendFeedback() {
        this.analytics.capture('bsa_about_click_sendFeedback')
    }

    logAboutPageClickReplayOnboarding() {
        this.analytics.capture('bsa_about_click_replayOnboarding')
    }

    logHistoryPageView() {
        this.analytics.capture('bsa_history_view')
    }
}