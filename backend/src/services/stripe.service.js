import { Stripe } from "stripe";

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

         const account = await this.stripe.accounts.create({
        type: "express",
        country: "us",
        email: email,
        business_type: "individual",

        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          product_description: "Online marketplace sales",
          mcc: "5699",
        },

        settings: {
          payouts: {
            schedule: {
              interval: "manual",
            },
          },
        },

        metadata: {
          onboarding_type: "deferred",
        },
      });

        return account;
    }

    async getOnboardingLink(accountId) {

        const accountLink =  await this.stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.FRONTEND_URL}/vendor/profile`,
      return_url: `${process.env.FRONTEND_URL}/vendor/onboarding-success`,
      type: "account_onboarding",
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

    async retrieveAccount(accountId) {
        const account = await this.stripe.accounts.retrieve(accountId);
        return account;
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

    async createLoginLink(accountId) {
        const accountLink = await this.stripe.accounts.createLoginLink(accountId);

        return accountLink;
    }
}

export default new StripeService();
