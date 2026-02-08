const { Stripe } = require("stripe");
const { COMMISSION_RATE, FRONTEND_URL } = require("../utils/constants");

class StripeService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    async createConnectedAccount(vendor, detailsPayload) {
        const { email, businessCategory, businessSize } = detailsPayload;
        const {
            vendorType,
            storeName,
            fullname,
            phoneNumber,
            _id: vendorId,
        } = vendor;

        const account = await this.stripe.v2.core.accounts.create({
            contact_email: email,
            contact_phone: phoneNumber,
            display_name: fullname,
            identity: {
                country: "us",
                entity_type: vendorType === "business" ? "company" : vendorType,
                business_details: {
                    registered_name: storeName,
                },
            },
            configuration: {
                merchant: {
                    capabilities: {
                        card_payments: {
                            requested: true,
                        },
                    },
                },
            },
            defaults: {
                currency: "usd",
                responsibilities: {
                    fees_collector: "stripe",
                    losses_collector: "stripe",
                },
            },
            dashboard: "full",
            include: ["configuration.merchant", "identity", "defaults"],
            metadata: {
                vendor_id: vendorId,
                commission_rate: COMMISSION_RATE + "%",
                business_category: businessCategory,
                business_size: businessSize,
            },
        });

        return account;
    }

    async getOnboardingLink(accountId) {
        const accountLink = await this.stripe.v2.core.accountLinks.create({
            account: accountId,
            use_case: {
                type: "account_onboarding",
                account_onboarding: {
                    configurations: ["merchant"],
                    refresh_url: FRONTEND_URL,
                    return_url: FRONTEND_URL + "/success",
                },
            },
        });

        return accountLink.url;
    }

    async makePaymentTransfer(vendorPayoutId, amount, accountId) {
        const transfer = await this.stripe.transfers.create({
            amount: Math.floor((amount * 100) / 83),
            currency: "usd",
            destination: accountId,
            description: `Adding funds to ${accountId} account`,
            metadata: {
                vendorPayoutId,
            },
        });

        return transfer;
    }

    async makePayout(vendorPayoutId, amount, accountId) {
        const payout = await this.stripe.payouts.create(
            {
                amount: Math.floor((amount * 100) / 83),
                currency: "usd",
                method: "standard",
                description: "Payout sent",
                metadata: {
                    vendorPayoutId,
                },
            },
            {
                stripeAccount: accountId,
            },
        );

        return payout;
    }

    async updatePayoutSchedule(accountId) {
        const balanceSettings = await this.stripe.balanceSettings.update(
            {
                payments: {
                    payouts: {
                        schedule: {
                            interval: "manual",
                        },
                    },
                },
            },
            {
                stripeAccount: accountId,
            },
        );

        return balanceSettings;
    }
}

module.exports = new StripeService();
