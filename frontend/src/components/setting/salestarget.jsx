import React, { useEffect, useMemo, useState } from 'react';
import { INV_KEY, SALES_TARGETS_KEY, fyLabel, fyOf, today, useStore } from '../../store/erpstore';
import '../../styles/salestarget.css';

const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const emptyMonths = () => Array(12).fill('0');
const amount = (value) => `₹${Math.round(Number(value) || 0).toLocaleString('en-IN')}`;

export default function SalesTargets() {
  const [plans, setPlans] = useStore(SALES_TARGETS_KEY, []);
  const [invoices] = useStore(INV_KEY, []);
  const [editing, setEditing] = useState(null);
  const [financialYear, setFinancialYear] = useState(fyOf(today()));
  const [annualTarget, setAnnualTarget] = useState('0');
  const [monthlyTargets, setMonthlyTargets] = useState(emptyMonths);
  const [error, setError] = useState('');

  const currentFy = fyOf(today());
  const yearOptions = useMemo(() => {
    const savedYears = plans.map((plan) => Number(plan.financialYear));
    const invoiceYears = invoices.map((invoice) => fyOf(invoice.date));
    return [...new Set([
      ...savedYears,
      ...invoiceYears,
      ...Array.from({ length: 6 }, (_, index) => currentFy + index),
    ])].sort((a, b) => b - a);
  }, [plans, invoices, currentFy]);

  const closeForm = () => {
    setEditing(null);
    setError('');
  };

  useEffect(() => {
    if (!editing) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setEditing(null);
        setError('');
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [editing]);

  const openForm = (plan = null) => {
    const fy = plan?.financialYear ?? currentFy;
    const existingPlan = plan?.months
      ? plan
      : plans.find((item) => Number(item.financialYear) === Number(fy));
    setFinancialYear(fy);
    setAnnualTarget(String(existingPlan?.annualTarget ?? 0));
    setMonthlyTargets(existingPlan
      ? MONTHS.map((_, index) => String(existingPlan.months[index] ?? 0))
      : emptyMonths());
    setError('');
    setEditing(existingPlan || { financialYear: fy });
  };

  const save = (event) => {
    event.preventDefault();
    const values = monthlyTargets.map((value) => Number(value));
    const annual = Number(annualTarget);
    if (String(annualTarget).trim() === '' || !Number.isFinite(annual) || annual < 0) {
      setError('Enter a valid annual target of zero or more.');
      return;
    }
    if (monthlyTargets.some((value) => String(value).trim() === '') ||
      values.some((value) => !Number.isFinite(value) || value < 0)) {
      setError('Enter a valid target amount of zero or more for each month.');
      return;
    }

    const existing = plans.some((plan) => Number(plan.financialYear) === Number(financialYear));
    if (existing) {
      setPlans((list) => list.map((plan) => (
        Number(plan.financialYear) === Number(financialYear)
          ? { ...plan, financialYear: Number(financialYear), annualTarget: annual, months: values }
          : plan
      )));
    } else {
      setPlans((list) => [
        ...list,
        { id: Number(financialYear), financialYear: Number(financialYear), annualTarget: annual, months: values },
      ]);
    }
    closeForm();
  };

  const remove = (plan) => {
    if (window.confirm(`Delete sales targets for FY ${fyLabel(plan.financialYear)}?`)) {
      setPlans((list) => list.filter((item) => Number(item.financialYear) !== Number(plan.financialYear)));
    }
  };

  const cards = [...plans].sort((a, b) => b.financialYear - a.financialYear);
  const targetTotal = monthlyTargets.reduce((total, value) => total + (Number(value) || 0), 0);

  return (
    <div className="sales-target-page">
      <header className="sales-target-header">
        <div className="sales-target-heading">
          <span className="sales-target-icon"><i className="fas fa-bullseye" /></span>
          <div>
            <h1>Sales Targets</h1>
            <p>Yearly &amp; monthly sales targets by financial year</p>
          </div>
        </div>
        <div className="sales-target-header-actions">
          <span className="sales-target-back" title="Set a target for each month in a financial year">
            <i className="fas fa-circle-info" /> How it works
          </span>
          <button type="button" className="erp-btn" onClick={() => openForm()}>+ Add Target</button>
        </div>
      </header>

      <section className="sales-target-years" aria-label="Financial year sales targets">
        {cards.length ? cards.map((plan) => {
          const months = MONTHS.map((_, index) => Number(plan.months?.[index]) || 0);
          const annualTotal = months.reduce((total, value) => total + value, 0);
          return (
            <article className="sales-target-year-card" key={plan.id ?? plan.financialYear}>
              <div className="sales-target-year-heading">
                <h2>FY {fyLabel(Number(plan.financialYear))}</h2>
                <div className="sales-target-year-actions">
                  <button type="button" className="sales-target-edit" onClick={() => openForm(plan)} aria-label={`Edit FY ${fyLabel(Number(plan.financialYear))} targets`}>
                    <i className="fas fa-pen" />
                  </button>
                  <button type="button" className="sales-target-delete" onClick={() => remove(plan)} aria-label={`Delete FY ${fyLabel(Number(plan.financialYear))} targets`}>
                    <i className="fas fa-trash" />
                  </button>
                </div>
                <strong>Yearly: {amount(plan.annualTarget ?? annualTotal)}</strong>
              </div>
              <div className="sales-target-month-grid">
                {MONTHS.map((month, index) => (
                  <div className="sales-target-month" key={month}>
                    <span>{month}</span>
                    <b>{amount(months[index])}</b>
                  </div>
                ))}
              </div>
            </article>
          );
        }) : (
          <div className="sales-target-empty">
            No targets saved yet. Click <b>+ Add Target</b> to set monthly goals for a financial year.
          </div>
        )}
      </section>

      {editing && (
        <div className="erp-overlay sales-target-overlay" onMouseDown={(event) => event.target === event.currentTarget && closeForm()}>
          <form className="erp-modal sales-target-modal" onSubmit={save} noValidate>
            <div className="erp-modal-head">
              <h3>{plans.some((plan) => Number(plan.financialYear) === Number(financialYear)) ? 'Edit Sales Target' : 'Add Sales Target'}</h3>
              <button type="button" className="erp-x" aria-label="Close" onClick={closeForm}>×</button>
            </div>
            <div className="sales-target-form-fields">
              <label>
                <span>Financial Year *</span>
                <select value={financialYear} onChange={(event) => openForm({ financialYear: Number(event.target.value) })}>
                  {yearOptions.map((year) => <option key={year} value={year}>FY {fyLabel(year)}</option>)}
                </select>
              </label>
              <label>
                <span>Annual Target (₹) *</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={annualTarget}
                  onChange={(event) => {
                    setAnnualTarget(event.target.value);
                    setError('');
                  }}
                />
              </label>
            </div>
            <div className="sales-target-form-summary">
              Monthly targets total: <b>{amount(targetTotal)}</b>
            </div>
            <div className="sales-target-month-fields">
              {MONTHS.map((month, index) => (
                <label key={month}>
                  <span>{month}</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={monthlyTargets[index]}
                    onChange={(event) => {
                      const next = [...monthlyTargets];
                      next[index] = event.target.value;
                      setMonthlyTargets(next);
                      setError('');
                    }}
                  />
                </label>
              ))}
            </div>
            {error && <p className="erp-err">{error}</p>}
            <div className="erp-modal-foot">
              <button type="button" className="erp-btn ghost" onClick={closeForm}>Cancel</button>
              <button type="submit" className="erp-btn">Save Target</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
