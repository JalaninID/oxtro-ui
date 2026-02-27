<script lang="ts">
	import type { Contact } from "@oxtro-ui/proto/gen/sample_crm/v1/crm_pb";
	import type { UiNode } from "@oxtro-ui/proto/gen/plugin/v1/plugin_pb";

	type FormState = {
		name: string;
		email: string;
		phone: string;
		company: string;
		notes: string;
	};

	let {
		node,
		rows = [],
		total = 0,
		formState,
		onSubmitForm
	}: {
		node: UiNode;
		rows?: Contact[];
		total?: number;
		formState?: FormState;
		onSubmitForm?: () => Promise<void>;
	} = $props();

	function parseColumns(columnsRaw: string | undefined): Array<{ key: string; label: string }> {
		if (!columnsRaw) {
			return [];
		}
		try {
			const parsed = JSON.parse(columnsRaw) as Array<{ key: string; label: string }>;
			return Array.isArray(parsed) ? parsed : [];
		} catch {
			return [];
		}
	}

	const columns = $derived(parseColumns(node.props?.columns));
</script>

{#if node.component === "table"}
	<div class="rounded-md border p-4">
		<p class="mb-2 text-sm font-medium">
			{node.props?.title || "Table"} ({total})
		</p>
		{#if rows.length === 0}
			<p class="text-muted-foreground text-sm">No data found.</p>
		{:else}
			<div class="overflow-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="border-b">
							{#each columns as col (col.key)}
								<th class="px-2 py-2 font-medium">{col.label}</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each rows as row (row.uuid)}
							<tr class="border-b">
								{#each columns as col (`${row.uuid}-${col.key}`)}
									<td class="px-2 py-2">{(row as unknown as Record<string, string>)[col.key] ?? "-"}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
{:else if node.component === "form" && formState && onSubmitForm}
	<form
		class="flex max-w-xl flex-col gap-3 rounded-md border p-4"
		onsubmit={async (event) => {
			event.preventDefault();
			await onSubmitForm();
		}}
	>
		<input class="rounded-md border px-3 py-2" placeholder="Name" bind:value={formState.name} required />
		<input class="rounded-md border px-3 py-2" type="email" placeholder="Email" bind:value={formState.email} required />
		<input class="rounded-md border px-3 py-2" placeholder="Phone" bind:value={formState.phone} />
		<input class="rounded-md border px-3 py-2" placeholder="Company" bind:value={formState.company} />
		<textarea class="rounded-md border px-3 py-2" placeholder="Notes" bind:value={formState.notes}></textarea>
		<button class="w-fit rounded-md border px-4 py-2" type="submit">Save Contact</button>
	</form>
{:else}
	<div class="rounded-md border border-dashed p-4 text-sm">
		Renderer for component <code>{node.component}</code> is not implemented yet.
	</div>
{/if}
